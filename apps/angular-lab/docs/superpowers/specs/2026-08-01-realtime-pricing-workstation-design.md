# Real-time Pricing Workstation Design

## Goal

Create a small Angular 21 learning application that demonstrates a realistic
fixed-income trading UI data flow: obtain an initial REST snapshot, subscribe
to a real WebSocket stream of price deltas, update an AG Grid efficiently, and
make data freshness visible to the user.

## Scope

- A Node development server exposes `GET /api/prices/snapshot` and a WebSocket
  endpoint at `/ws/prices`.
- The server owns six deterministic mock MBS/TBA instruments and periodically
  broadcasts versioned price updates. It can deliberately pause or burst
  updates for learning purposes.
- A lazy Angular route, `/realtime-pricing`, displays the instruments using AG
  Grid Community.
- `PricingFeedService` obtains a snapshot, connects to the stream, coalesces
  same-frame deltas, and exposes connection state, last update time, and row
  updates to the component.
- The UI applies updates through AG Grid transactions with stable row IDs;
  it does not replace the complete row-data array for every message.
- The UI has controls for reconnecting, simulating a server pause, and
  triggering a short burst. A stale state appears if prices stop arriving.
- Unit tests cover the pure quote-reconciliation logic: out-of-order and
  duplicate messages are ignored, newer prices update a row, and a snapshot
  replaces stale client state after reconnect.

## Data flow

1. The Angular component asks `PricingFeedService` to start.
2. The service fetches the REST snapshot and sends it to the grid as initial
   row data.
3. The service opens the WebSocket, receives `{ type: 'delta', sequence, quote
   }` events, validates their monotonic sequence, and buffers the latest delta
   per symbol until the next animation frame.
4. The component applies the resulting small update list with
   `api.applyTransaction({ update })`.
5. On close or an unrecoverable sequence gap, the service marks the stream
   stale, reconnects with bounded exponential backoff, and begins again from a
   fresh REST snapshot before it treats the display as current.

## Reliability choices

- **REST snapshot + WebSocket deltas:** a complete baseline makes reconnect
  recovery explicit.
- **Sequence numbers:** let the client ignore duplicates and detect unsafe
  ordering gaps.
- **Render batching:** transport frequency is decoupled from browser render
  frequency.
- **Stable grid row IDs:** AG Grid only changes affected rows.
- **Visible health:** `Connected`, `Reconnecting`, and `Stale` are user-facing
  states; stale prices are never silently presented as current.
- **Server authority:** the client can present a clear state but a production
  system would keep pricing, authorization, and audit truth on the server.

## Non-goals

- No genuine market data, order execution, authentication, or financial
  valuation model.
- No claim that the mock is a Citi system.
- No attempt to reproduce a full trading workstation; this is an interview
  learning exercise focused on the feed lifecycle and UI-performance choices.

## Verification

- `npm test` passes the quote-reconciliation tests.
- `npm run build` compiles the Angular application.
- Starting the server and Angular app locally shows the snapshot, live price
  changes, a visible reconnect, and a stale indicator after a simulated pause.
