# Offer Explorer Production-Style SRP Design

## Objective

Refactor the Offer Explorer into a production-style React feature that demonstrates the Single Responsibility Principle to a senior React interviewer. Preserve the current visual design and user-facing filtering, sorting, reset, and selection behavior while adding a simulated asynchronous data flow, accessible loading and error states, retry support, focused modules, and tests at meaningful seams.

## Scope

This change will:

- Separate domain types, sample data, data access, query policy, state orchestration, and rendering.
- Simulate asynchronous offer loading without adding a network dependency.
- Support loading, failure, retry, and request cancellation.
- Clear the effective selection when the selected offer is no longer in the filtered result set.
- Add comments only where architectural intent or behavior is not evident from the code.
- Add focused unit and integration tests.

This change will not:

- Connect to a real backend.
- Add a global store, React Context, a reducer, or a server-state library.
- Synchronize filters with URL search parameters.
- Redesign the existing page.
- Expand the offer domain beyond the current fields.

## Architecture

The feature will use small, feature-local modules with one primary responsibility each.

### Domain and sample data

`offer.types.ts` defines `Offer`, `OfferCategory`, `OfferSort`, and `OfferFilters`. It contains no React code or data-access behavior.

`offers.fixture.ts` owns the self-contained sample offers. The fixture is an implementation detail of the simulated repository rather than application state.

### Data-access seam

`offer.repository.ts` defines the repository interface and provides the simulated asynchronous adapter. Its interface exposes one operation:

```ts
getOffers(options?: { signal?: AbortSignal }): Promise<Offer[]>
```

The default adapter returns cloned fixture data after a short delay. It accepts an `AbortSignal` so React cleanup can cancel obsolete requests. Tests and the demo can inject deterministic failure behavior; failures will never be random.

This seam exists to demonstrate how the local adapter can later be replaced by an HTTP adapter without changing query policy or view modules.

### Query policy

`offer.query.ts` contains pure functions for:

- Filtering offers by normalized title, category, and recommendation status.
- Sorting by title or ascending APR, with offers lacking an APR placed last.
- Deriving unique categories.
- Determining whether filters differ from their defaults.

The primary interface is a `queryOffers(offers, filters)` function. It must not mutate the input array. Search normalization will be shared with active-filter detection so whitespace-only input behaves consistently.

### State orchestration

`useOfferExplorer.ts` coordinates the repository and local interaction state. It owns:

- Loading, success, and error request state.
- Retry attempts and request cancellation.
- Search, category, recommendation, and sort values.
- The selected offer ID.
- Derived visible offers, categories, active-filter status, and selected offer.

The hook returns one cohesive view model containing state plus commands such as setting filters, selecting an offer, resetting filters, and retrying the request.

Selection is valid only while the selected ID exists in the visible result set. Each filter command computes the next visible results and clears the stored selection in the same user action when the selected offer would be hidden. The details placeholder therefore renders immediately, and removing the filter does not silently reselect the old offer. This avoids a follow-up `useEffect` that repairs already-rendered state.

### View modules

The rendering layer is divided only at meaningful responsibility seams:

- `OfferFilters` renders controlled filter and sorting controls and emits user changes.
- `OfferList` renders result count, empty state, and the collection of cards.
- `OfferCard` renders one offer and emits selection.
- `OfferDetails` renders either the selected offer or its placeholder.
- `OfferExplorer` composes the hook and view modules and selects the loading, error, or success presentation.

View modules do not fetch data or implement filtering and sorting policy. They receive typed props and emit events.

## Data Flow

1. `OfferExplorer` invokes `useOfferExplorer` with the default repository.
2. The hook requests offers and exposes a loading state.
3. The repository resolves cloned offers or a deterministic error.
4. On success, the hook passes offers and filters through the pure query module.
5. The page maps the hook's view model into focused view-module props.
6. User events flow back into hook commands, causing derived results to update synchronously.
7. Retry starts a fresh repository request while preserving filter values.

## Loading, Error, and Cancellation Behavior

The initial request shows an accessible loading state in the results area. Filters and results are not rendered until offer data is available.

A non-abort failure shows a concise error message and a Retry button. Retry preserves current filter state and starts a new request. If a request is aborted during cleanup, it must not transition the feature into an error state or update state after cleanup.

The repository failure mechanism must be deterministic and injectable so tests and interview demonstrations remain reliable.

## Accessibility

Existing explicit labels, semantic sections, articles, definition lists, focus-visible styles, and polite result announcements will be preserved. Loading uses an appropriate status announcement. Errors use an alert announcement, and Retry is a real button. Tests will locate controls through roles and accessible names rather than styling hooks.

## Styling

The existing feature-local stylesheet remains the styling owner. Only loading and error presentation styles will be added. Component extraction must not change the existing layout, responsive behavior, or visual hierarchy.

## Testing Strategy

### Query unit tests

Verify:

- Case-insensitive and trimmed search.
- Whitespace-only search consistency.
- Combined search, category, and recommended filtering.
- Title and APR ordering.
- Null APR placement.
- Source-array immutability.
- Category derivation and active-filter detection.

### Repository unit tests

Verify:

- Delayed successful resolution.
- Returned data is cloned rather than exposing fixture mutation.
- Deterministic rejection.
- Abort rejection and timer cleanup.

### Feature integration tests

Verify:

- Loading transitions to successful results.
- Error transitions to success after retry.
- Filters and sorting update visible offers.
- Reset restores default filters.
- Selecting an offer renders details.
- Filtering a selected offer out returns details to the placeholder.
- Empty results provide a clear-filters action.

Tests will avoid broad snapshots and trivial assertions about implementation-specific CSS classes.

## Comments

Comments are reserved for decisions that are not self-evident, particularly simulated-adapter intent, abort handling, and the derived-selection invariant. Straightforward React rendering and event handlers will remain uncommented.

## Success Criteria

- `offer-explorer.tsx` is a small composition module rather than the owner of all feature behavior.
- Each module has one primary reason to change and a small typed interface.
- The demo visibly supports loading, deterministic failure, retry, success, filtering, sorting, selection, and empty results.
- The details panel never presents an offer outside the current visible results.
- Pure query rules and async repository behavior are independently testable.
- Integration tests cover the user-visible lifecycle and selection fix.
- Existing unrelated workspace changes remain untouched.
- Type checking, tests, and the production build pass.
