# Angular interview practice

Each route is a small coding-round problem. Before reading the method, restate the problem, ask about edge cases, describe a simple approach, then discuss complexity.

1. Search/sort: filtering is O(n); sorting is O(n log n). Avoid mutating the source array.
2. Group/aggregate: use a Map for an O(n) pass.
3. Build tree: map nodes first, connect parents second, O(n).
4. Debounce: explain `debounceTime`, `distinctUntilChanged`, and cleanup.
5. Request state: `switchMap` unsubscribes from stale requests; keep `catchError` inside it.
6. Interactive list: use immutable add, update, and delete operations.
7. Tree traversal: iterative DFS uses a stack and runs in O(n).
