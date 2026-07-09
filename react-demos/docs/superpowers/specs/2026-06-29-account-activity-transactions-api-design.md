# Account Activity Transactions API Design

## Goal

Implement `getTransactions(signal?: AbortSignal)` for the Day 2 interview exercise using a free public HTTP endpoint while keeping the component independent from that endpoint's response shape.

## Approaches considered

1. **DummyJSON products with an adapter (selected).** Stable, no authentication, supports an artificial response delay, and provides enough fields to create deterministic transaction fixtures. The tradeoff is that product data must be translated into financial activity.
2. **JSONMockAPI transactions.** Its domain matches the exercise more closely, but its generated response is less predictable and therefore makes repeatable UI behavior and tests harder.
3. **A local simulated API.** Gives complete control over success, failure, and cancellation, but does not exercise a real HTTP request.

## Design

`getTransactions` will request `https://dummyjson.com/products?limit=12&delay=700` and pass the caller's `AbortSignal` directly to `fetch`.

The store module will define private DTO types for the DummyJSON response. A pure mapper will convert each product into the application's existing `Transaction` type. IDs and descriptions come from the product. Product metadata supplies the date. Categories and signed amounts are assigned deterministically from the product ID so repeated calls produce the same activity, including income and expenses across all four application categories.

The public function returns only `Transaction[]`; components never depend on DummyJSON fields.

## Error and cancellation behavior

- A non-success HTTP response throws `Error("Unable to load transactions")`.
- A malformed response throws the same user-facing error.
- An aborted fetch retains the browser's `AbortError` rather than converting it into a loading error, allowing the React Effect to ignore cancellation cleanly.
- Network failures are normalized to `Error("Unable to load transactions")` unless they are aborts.

## Testing

Use Vitest with an injected or stubbed `fetch` implementation to verify:

1. Successful responses are mapped into the application transaction shape.
2. The provided `AbortSignal` is passed to `fetch`.
3. Non-success responses reject with the expected message.
4. Abort errors remain identifiable as aborts.

Tests will be written and observed failing before production implementation.

## Scope

This change implements only the store function and its tests. React loading, retry, filtering, totals, selection, and Effect cleanup remain separate Day 2 milestones.
