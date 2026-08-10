import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ConnectionState, FeedMessage, PriceQuote, PriceSnapshot } from './pricing.models';
import { QuoteReconciler } from './quote-reconciler';

const apiUrl = 'http://localhost:4300';
const staleAfterMs = 2_000;

@Injectable({ providedIn: 'root' })
export class PricingFeedService {
  readonly rows = signal<PriceQuote[]>([]);
  readonly connectionState = signal<ConnectionState>('stale');
  readonly lastUpdated = signal<string | null>(null);
  readonly updates = new Subject<PriceQuote[]>();
  private readonly reconciler = new QuoteReconciler();
  private socket?: WebSocket;
  private reconnectTimer?: number;
  private staleTimer?: number;
  private animationFrame?: number;
  private pendingBySymbol = new Map<string, PriceQuote>();
  private stopped = false;
  private reconnectAttempt = 0;
  private connectionGeneration = 0;

  async start(): Promise<void> {
    this.stopped = false;
    await this.refreshSnapshotAndConnect();
  }
  stop(): void {
    this.stopped = true;
    window.clearTimeout(this.reconnectTimer);
    window.clearTimeout(this.staleTimer);
    cancelAnimationFrame(this.animationFrame ?? 0);
    this.socket?.close();
  }
  async reconnectNow(): Promise<void> {
    this.socket?.close();
    await this.refreshSnapshotAndConnect();
  }
  async toggleServerPause(): Promise<void> {
    await fetch(`${apiUrl}/api/prices/pause`, { method: 'POST' });
  }
  async requestBurst(): Promise<void> {
    await fetch(`${apiUrl}/api/prices/burst`, { method: 'POST' });
  }

  private async refreshSnapshotAndConnect(): Promise<void> {
    try {
      this.connectionState.set('reconnecting');
      const snapshot = (await fetch(`${apiUrl}/api/prices/snapshot`).then((response) =>
        response.json(),
      )) as PriceSnapshot;
      this.rows.set(this.reconciler.replaceSnapshot(snapshot.sequence, snapshot.quotes));
      this.lastUpdated.set(new Date().toISOString());
      this.openSocket();
    } catch {
      this.markStaleAndScheduleReconnect();
    }
  }

  private openSocket(): void {
    this.socket = new WebSocket('ws://localhost:4300/ws/prices');
    this.socket.onopen = () => {
      this.reconnectAttempt = 0;
      this.connectionState.set('connected');
      this.scheduleStaleCheck();
    };
    this.socket.onmessage = (event) =>
      this.handleMessage(JSON.parse(event.data) as FeedMessage | { type: 'ready' });
    this.socket.onerror = () => this.socket?.close();
    this.socket.onclose = () => {
      if (!this.stopped) this.markStaleAndScheduleReconnect();
    };
  }

  private handleMessage(message: FeedMessage | { type: 'ready' }): void {
    if (message.type !== 'delta') return;
    const result = this.reconciler.applyDelta(message.sequence, message.quote);
    if (result.kind === 'resync-required') {
      void this.refreshSnapshotAndConnect();
      return;
    }
    if (result.kind === 'applied') {
      this.pendingBySymbol.set(result.quote.symbol, result.quote);
      this.lastUpdated.set(result.quote.updatedAt);
      this.connectionState.set('connected');
      this.scheduleStaleCheck();
      this.flushUpdatesOnNextFrame();
    }
  }

  private flushUpdatesOnNextFrame(): void {
    if (this.animationFrame) return;
    // Transport can be faster than rendering: emit only the newest update per row each frame.
    this.animationFrame = requestAnimationFrame(() => {
      const updates = [...this.pendingBySymbol.values()];
      this.pendingBySymbol.clear();
      this.animationFrame = undefined;
      if (updates.length) this.updates.next(updates);
    });
  }
  private scheduleStaleCheck(): void {
    window.clearTimeout(this.staleTimer);
    this.staleTimer = window.setTimeout(() => this.connectionState.set('stale'), staleAfterMs);
  }
  private markStaleAndScheduleReconnect(): void {
    this.connectionState.set('stale');
    window.clearTimeout(this.reconnectTimer);
    const delay = Math.min(1_000 * 2 ** this.reconnectAttempt++, 8_000);
    this.reconnectTimer = window.setTimeout(() => void this.refreshSnapshotAndConnect(), delay);
  }
}
