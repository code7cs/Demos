# React Search Component: Architecture and Implementation Options

## Status

This document records the proposed architecture and the choices that must be made before implementation. It is not yet the final implementation specification.

The repository currently uses React 19, TypeScript, Vite, and Vitest. Existing demos often separate presentation from state/data behavior, so the recommended design follows that convention without introducing another state-management or data-fetching dependency.

## Definition of done

The feature is done when:

- The component renders the required wrapper, input, loading indicator, and suggestion markup with the exact required class names.
- Input changes trigger an API request only after 500 ms without another change.
- The query is encoded and sent using the required query parameter.
- Loading is displayed only for the request that is currently relevant.
- Suggestions are rendered in API order only after a successful, non-empty response.
- The suggestion list is absent before a request, while loading, and when the result is empty.
- Clicking a suggestion calls `onSelectItem` with that suggestion.
- Tests/examples demonstrate the 500 ms boundary, loading transition, result rendering, empty-result behavior, stale-request protection, and selection callback.
- The production build and automated tests pass.

Exact API response types, URL/query-parameter name, and mandatory HTML/class names must be copied from the assessment's detailed specification before implementation.

## Recommended general architecture

```text
Search component
  |-- controlled input and required DOM structure
  |-- renders loading or suggestions from hook state
  |-- forwards clicked item to onSelectItem
  |
  +-- useSearchSuggestions hook
        |-- owns query/request state
        |-- applies the 500 ms debounce
        |-- prevents stale responses from replacing newer results
        |
        +-- fetchSuggestions API adapter
              |-- constructs URL and query parameter
              |-- performs fetch
              +-- validates/maps the response into Suggestion[]
```

### Proposed files

- `src/search/Search.tsx`: public props and required rendering structure.
- `src/search/useSearchSuggestions.ts`: debounce, request lifecycle, and state transitions.
- `src/search/search.api.ts`: API URL construction and response mapping.
- `src/search/Search.test.tsx`: user-visible component behavior and callback tests.
- `src/search/useSearchSuggestions.test.ts`: fake-timer and request-race tests if hook behavior becomes cumbersome to prove through the component alone.
- `src/search/Search.css`: only required Bulma-compatible or local styling; no decorative scope expansion.
- Route/example files as needed to make the component inspectable in the demo app.

### Public interface

The smallest likely interface is:

```ts
type SearchProps = {
  onSelectItem: (item: Suggestion) => void;
};
```

The component should own the input value because the requirements describe a self-contained autocomplete. API details should stay behind `fetchSuggestions(query, signal?)`, keeping request construction out of JSX and making it independently testable.

### State model

Use explicit state rather than deriving UI from loosely related booleans:

```ts
type SearchState =
  | { status: 'idle'; suggestions: [] }
  | { status: 'debouncing'; suggestions: [] }
  | { status: 'loading'; suggestions: [] }
  | { status: 'success'; suggestions: Suggestion[] }
  | { status: 'error'; suggestions: [] };
```

This makes the list rule mechanical: render it only when `status === 'success' && suggestions.length > 0`. The required loading element renders only for `status === 'loading'`.

## Decision 1: Debouncing

### Option A — debounce in `useEffect` with `setTimeout` (recommended)

The input updates immediately. An effect starts a 500 ms timer for the latest query and clears the prior timer whenever the query changes or the component unmounts. When the timer expires, the hook begins the request.

**Benefits**

- Uses only React and browser primitives; no new dependency.
- Cleanup behavior maps naturally to React's effect lifecycle.
- Easy to keep the displayed input responsive while delaying only the request.
- Fits this repository's existing hook-based organization.

**Risks**

- React Strict Mode runs effect setup/cleanup more than once in development, so cleanup must be correct.
- Debouncing alone does not solve out-of-order responses; request cancellation or request identity is still required.
- Careless dependencies can recreate timers unnecessarily.

**Complexity:** Low.

**Difficulty to test:** Low. Vitest fake timers can assert no request at 499 ms and exactly one request at 500 ms. Tests must wrap timer advancement in React's `act`.

### Option B — reusable debounced callback hook

Create `useDebouncedCallback`, which keeps a timer in a ref and returns a stable function. The input handler passes each query into that function; the delayed callback starts the request.

**Benefits**

- Encapsulates timer mechanics and can be reused by future components.
- Keeps the request effect smaller or removes it entirely.
- Can expose explicit `cancel`/`flush` behavior if later requirements need it.

**Risks**

- More abstraction than this feature currently needs.
- Stale callback closures and argument typing require care.
- Cancellation on unmount and Strict Mode behavior become custom-hook responsibilities.

**Complexity:** Medium.

**Difficulty to test:** Medium. The hook needs isolated timer/cleanup tests in addition to component integration tests.

## Decision 2: Loading and request lifecycle

### Option A — status state plus `AbortController` (recommended)

When the debounce expires, set status to `loading`, clear suggestions, create an `AbortController`, and pass its signal to `fetch`. Abort the previous request when a new query becomes eligible or the component unmounts. Only a non-aborted request may set success/error state.

**Benefits**

- Prevents stale responses from replacing newer suggestions.
- Stops unnecessary network work when the browser/API supports abort signals.
- Gives deterministic loading and list visibility rules.
- Handles unmount safely.

**Risks**

- Abort errors must be recognized and ignored rather than shown as failures.
- Loading semantics need a deliberate rule when a user types while an older request is active. Recommended: clear results immediately, abort the old request, enter `debouncing`, then show loading only when the new request starts.
- Slightly more lifecycle code than a boolean flag.

**Complexity:** Medium.

**Difficulty to test:** Medium. Tests mock deferred promises and signals to prove cancellation, loading transitions, and stale-result protection.

### Option B — status state plus monotonically increasing request ID

Assign every request an incrementing ID. Store the latest ID in a ref and allow a response to update state only when its ID matches the latest one. No request is physically cancelled.

**Benefits**

- Works even when the API client cannot accept an abort signal.
- Out-of-order response handling is explicit and predictable.
- Avoids browser-specific abort error handling.

**Risks**

- Superseded requests continue consuming network and server resources.
- Correctness depends on every success, failure, and finalization path checking identity.
- A stale request's `finally` can incorrectly hide loading unless guarded carefully.

**Complexity:** Medium.

**Difficulty to test:** Medium. Deferred requests must be resolved in reverse order to prove stale success and stale finalization are ignored.

## Decision 3: Suggestion area rendering

### Option A — parent renders a dedicated `SuggestionList` (recommended)

`Search` contains the required conditional rule and renders a small `SuggestionList` only for non-empty successful results. `SuggestionList` owns the exact list/item/button structure and calls `onSelectItem(item)`.

**Benefits**

- Keeps asynchronous state decisions separate from repeated list markup.
- Exact structure and class names are concentrated in one place.
- Easy to add ARIA roles or keyboard navigation later without disturbing request code.
- Individual rows can use stable API IDs as React keys.

**Risks**

- Adds one small component/file.
- The boundary is unnecessary if each suggestion is only one trivial element and will never grow.

**Complexity:** Low.

**Difficulty to test:** Low. Most tests remain user-facing tests through `Search`; an isolated list test is optional.

### Option B — render the list inline in `Search`

Put the conditional `<ul>` and mapped suggestion items directly in `Search.tsx`.

**Benefits**

- Fewest files and indirections.
- The complete required DOM is visible in one component.
- Appropriate for a very small assessment component.

**Risks**

- Request-state branching and list markup compete for attention in one file.
- Keyboard navigation, highlighting, or richer item rendering will make the component grow quickly.
- Exact rendering rules are slightly easier to tangle with loading logic.

**Complexity:** Very low initially; medium if optional behavior is added.

**Difficulty to test:** Low for the minimum requirements; medium if interaction behavior expands.

## Recommended combination

Choose:

1. Debouncing Option A: `useEffect` plus `setTimeout`.
2. Loading Option A: explicit status plus `AbortController`.
3. Suggestions Option A: dedicated `SuggestionList`.

This combination uses no additional runtime dependencies, matches the repository's hook-oriented React style, and cleanly separates three concerns: when to request, which request may update state, and how results are rendered.

## Proposed data flow

1. The user types; `query` updates immediately.
2. Empty or whitespace-only input cancels pending work and returns to `idle` with no suggestions.
3. A non-empty query enters `debouncing`; no list or loading indicator is rendered.
4. If the query remains unchanged for 500 ms, the hook enters `loading` and calls the API with an encoded query parameter.
5. A newer query cancels or supersedes the older request and clears its results.
6. A successful non-empty response enters `success` and renders suggestions in returned order.
7. An empty response enters `success` with an empty array, so no list renders.
8. Clicking an item calls `onSelectItem(item)`. Unless the detailed spec says otherwise, selection does not automatically overwrite or clear the input.
9. An unexpected failure enters `error`, renders no list, and leaves optional error UI out of scope.

## Test strategy

The repository has Vitest and jsdom but does not currently list React Testing Library. Two viable testing setups are:

- Add React Testing Library and `user-event` for readable behavior-first component tests. This is the recommended testing dependency choice if dependency changes are allowed.
- Use `react-dom/client`, DOM events, and React `act` directly. This avoids dependencies but produces more test plumbing.

Minimum test cases:

1. Required wrapper/input markup and class names render.
2. Empty input does not request or render a list.
3. Typing does not request at 499 ms.
4. Exactly one request starts at 500 ms with the correctly encoded query parameter.
5. Loading markup appears after the request starts and the suggestion list is absent.
6. Successful suggestions replace loading and render in API order.
7. Empty results remove loading and render no list.
8. Clicking a suggestion calls `onSelectItem` exactly once with the correct item.
9. Rapid typing cancels/reset timers so only the final query is requested.
10. A superseded slow response cannot overwrite the newest results.
11. Unmounting clears timers and aborts/ignores pending work.

## Open integration details

Before implementation, confirm or provide:

- API endpoint, query-parameter name, and response shape.
- `Suggestion` fields and the value used as the React key.
- Exact required wrapper, input, loading, list, and item class names/structure.
- Whether whitespace-only input should count as no request (recommended: yes).
- Whether selection should also populate/clear the input (recommended default: callback only).
- Whether adding React Testing Library is acceptable.

## Explicitly deferred nice-to-haves

ARIA combobox semantics, keyboard navigation, matched-text highlighting, visible error messages, caching, and custom styling should be separate follow-up work unless the final specification promotes them into required scope.
