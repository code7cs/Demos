# Angular interview practice design

## Goal

Add a runnable Angular practice area for seven common frontend coding exercises. The examples should resemble a real Angular application, use RxJS rather than signals, and remain small enough to reproduce during a live interview.

## Structure

Create `src/interview-practice` with a home component, feature routes, shared banking models, a mock API service, and seven standalone exercise components:

1. Search, filter, and sort a transaction collection.
2. Group transactions and calculate aggregates.
3. Build an account hierarchy from flat records.
4. Debounce user input with RxJS.
5. Fetch data with loading, error, and stale-request handling.
6. Render and update an interactive transaction list.
7. Traverse and search a nested account tree.

Each exercise has its own component TypeScript, HTML, CSS, and test file. A practice home page links to every exercise.

## State and data flow

Use ordinary component fields for synchronous state. Use RxJS for event streams and asynchronous work, including `Subject`, `BehaviorSubject`, `debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`, `finalize`, and `takeUntilDestroyed` where they improve the example.

Do not force RxJS into synchronous algorithms. Collection transformations and tree traversal remain normal TypeScript methods inside their exercise components so candidates can rehearse them from one file.

## Request behavior

The shared mock API simulates latency and failures. The request-state exercise uses `switchMap` so a new query unsubscribes from the previous request. The UI exposes loading, empty, success, and error states.

## Testing

Use the repository's Vitest setup. Tests cover successful behavior and useful edge cases such as empty input, case-insensitive search, missing parents in flat tree data, rapid queries, API errors, duplicate identifiers, and list deletion.

## Interview usability

The README contains a prompt, expected behavior, complexity discussion, and concise talking points for each exercise. Reference implementations remain intentionally compact. They favor code a candidate could explain and reproduce in a live coding environment over production-level abstraction.

## Integration

Add the practice area to the existing Angular router without replacing current demos. Existing `src/coding-round` examples remain unchanged.
