# Real-time Pricing Workstation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real WebSocket and AG Grid Angular exercise that demonstrates snapshot-plus-delta pricing updates, reconnection, and stale-data visibility.

**Architecture:** A small Node server owns mock MBS quotes, serves a REST snapshot, and broadcasts versioned WebSocket deltas. An Angular feed service reconciles snapshots/deltas and exposes health state. The component uses stable AG Grid IDs and transactions for incremental rendering.

**Tech Stack:** Angular 21, RxJS, AG Grid Community, Node.js, ws, Vitest.

---

### Task 1: Add runtime dependencies and development server

**Files:**

- Modify: `package.json`
- Create: `server/realtime-pricing-server.mjs`

- [ ] Add `ag-grid-angular`, `ag-grid-community`, `ws`, and a `start:pricing-server` script.
- [ ] Implement `GET /api/prices/snapshot`, `POST /api/prices/pause`, `POST /api/prices/burst`, and `/ws/prices`.
- [ ] Broadcast `{ type: 'delta', sequence, quote }` at an interval; use a six-row in-memory quote set.
- [ ] Manually start the server and verify the snapshot endpoint and WebSocket connection.

### Task 2: Test and implement quote reconciliation

**Files:**

- Create: `src/realtime-pricing/pricing.models.ts`
- Create: `src/realtime-pricing/quote-reconciler.ts`
- Create: `src/realtime-pricing/quote-reconciler.spec.ts`

- [ ] Write failing tests for accepting newer sequential deltas, ignoring duplicate/older deltas, and replacing state with a snapshot.
- [ ] Implement a pure `QuoteReconciler` with `replaceSnapshot()` and `applyDelta()`.
- [ ] Run the targeted tests and confirm they pass.

### Task 3: Add the real WebSocket feed service

**Files:**

- Create: `src/realtime-pricing/pricing-feed.service.ts`

- [ ] Fetch the snapshot before connecting to WebSocket.
- [ ] Use native browser `WebSocket`; parse deltas, reconcile sequence numbers, and batch latest per-symbol updates in an animation frame.
- [ ] Expose signals for rows, connection state, and last update time.
- [ ] Mark data stale on close/error; reconnect using bounded exponential backoff and start from a fresh snapshot.
- [ ] Expose controls that call the server's pause/burst endpoints.

### Task 4: Add the AG Grid workstation route and UI

**Files:**

- Create: `src/realtime-pricing/realtime-pricing.component.ts`
- Create: `src/realtime-pricing/realtime-pricing.component.html`
- Create: `src/realtime-pricing/realtime-pricing.component.css`
- Modify: `src/app/app.routes.ts`
- Modify: `src/app/app.html`

- [ ] Configure AG Grid Community with `getRowId: params => params.data.symbol` and column definitions for symbol, price, bid, ask, daily change, sequence, and update time.
- [ ] Load snapshot rows as grid data; subsequently call `applyTransaction({ update })` for feed batches.
- [ ] Display `Connected`, `Reconnecting`, or `Stale` state and last-update time.
- [ ] Add Pause updates, Burst updates, and Reconnect buttons, with concise comments beside learning-critical code.

### Task 5: Verify and document the learning workflow

**Files:**

- Create: `src/realtime-pricing/README.md`

- [ ] Run `npm test` and `npm run build`.
- [ ] Start both local processes and confirm snapshot load, live deltas, burst behavior, pause-to-stale transition, reconnect, and fresh snapshot recovery.
- [ ] Document commands, architecture, and interview talking points.
