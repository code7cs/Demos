# Real-time Pricing Workstation

This is an interview-practice demo for a data-heavy trading UI. It intentionally uses **real local transports**:

- `GET /api/prices/snapshot` returns a complete baseline.
- `ws://localhost:4300/ws/prices` sends price deltas with monotonic sequence numbers.
- AG Grid receives an initial snapshot, then updates only affected rows with `applyTransaction({ update })`.

## Run it

Use two terminals from `apps/angular-lab`:

```bash
npm run start:pricing-server
npm start
```

Open `http://localhost:4200/realtime-pricing`.

## What to observe

1. The grid first loads a REST snapshot.
2. Every ~400ms the server pushes a WebSocket delta.
3. The client coalesces updates by symbol until the next animation frame, then applies one small AG Grid transaction.
4. Click **Pause / resume server**. After two seconds the UI becomes `stale`; it does not silently imply that its displayed prices are current.
5. Click **Reconnect + snapshot**. The client obtains a new snapshot before treating its data as current again.
6. Click **Send 20-update burst**. The transport receives many messages, but a row is rendered only with its newest update in the frame.

## Code to study first

- `quote-reconciler.ts`: duplicate, out-of-order, and gap handling.
- `pricing-feed.service.ts`: snapshot + delta lifecycle, reconnection, stale state, and render batching.
- `realtime-pricing.component.ts`: stable `getRowId` and `applyTransaction` usage.

## Interview explanation

> I would use REST for the initial snapshot and WebSockets for incremental updates. I would keep transport frequency separate from rendering frequency: validate and coalesce events in a feed layer, then apply incremental grid transactions only to the changed rows. I would also make connection and stale-data states visible, because a fast screen that silently displays stale prices is unsafe in a trading workflow.
