# Angular Interview Practice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add seven runnable Angular and RxJS coding exercises for Citi frontend interview practice.

**Architecture:** Add a lazy-loaded `interview-practice` route with a home page and seven standalone components. Keep synchronous algorithms in their components for easy rehearsal, and use a shared injectable mock API plus RxJS for debounce and request-state exercises.

**Tech Stack:** Angular 21 standalone components, Angular Router, RxJS 7.8, TypeScript 5.9, Vitest

---

## File map

- Modify `src/app/app.routes.ts`: lazy-load the practice route tree.
- Modify `src/app/app.html`: add one navigation link to the practice home.
- Create `src/interview-practice/interview-practice.routes.ts`: home and seven child routes.
- Create `src/interview-practice/practice-home.component.{ts,html,css}`: exercise index.
- Create `src/interview-practice/shared/models.ts`: transaction, flat account, and tree node types plus fixture data.
- Create `src/interview-practice/shared/mock-api.service.ts`: cancellable delayed transaction search with a deterministic error query.
- Create one `{component.ts,component.html,component.css,component.spec.ts}` set in each numbered exercise folder.
- Create `src/interview-practice/README.md`: prompts, complexity, and speaking notes.

### Task 1: Route shell and shared domain data

**Files:**
- Modify: `src/app/app.routes.ts`
- Modify: `src/app/app.html`
- Create: `src/interview-practice/interview-practice.routes.ts`
- Create: `src/interview-practice/practice-home.component.ts`
- Create: `src/interview-practice/practice-home.component.html`
- Create: `src/interview-practice/practice-home.component.css`
- Create: `src/interview-practice/shared/models.ts`

- [ ] **Step 1: Define shared models and stable fixtures**

Define `Transaction` with `id`, `merchant`, `category`, `status`, `amountCents`, and `postedAt`. Define `FlatAccount` with `id`, `parentId`, and `name`, plus recursive `AccountNode extends FlatAccount { children: AccountNode[] }`. Export five transactions across grocery, travel, utilities, and shopping categories and six accounts forming two roots.

- [ ] **Step 2: Add the lazy route tree**

Add this route before the wildcard in `app.routes.ts`:

```ts
{
  path: 'interview-practice',
  loadChildren: () =>
    import('../interview-practice/interview-practice.routes').then(
      (module) => module.INTERVIEW_PRACTICE_ROUTES,
    ),
},
```

Define `INTERVIEW_PRACTICE_ROUTES` with an empty path for `PracticeHomeComponent` and lazy `loadComponent` entries named `search-sort`, `group-aggregate`, `build-tree`, `debounce`, `request-state`, `interactive-list`, and `tree-traversal`.

- [ ] **Step 3: Build the practice home**

Use a standalone OnPush component importing `RouterLink`. Render seven cards from a readonly array `{ path, title, summary }`, with a router link on each card. Add a single `Interview Practice` navigation link to `app.html`.

- [ ] **Step 4: Verify the shell compiles**

Run: `npm run build`

Expected: build exits 0 and Angular reports generated browser bundles.

### Task 2: Search, filter, and sort component

**Files:**
- Create: `src/interview-practice/01-search-sort/search-sort.component.ts`
- Create: `src/interview-practice/01-search-sort/search-sort.component.html`
- Create: `src/interview-practice/01-search-sort/search-sort.component.css`
- Create: `src/interview-practice/01-search-sort/search-sort.component.spec.ts`

- [ ] **Step 1: Write failing behavior tests**

Instantiate the component and assert that `getVisibleTransactions()` performs case-insensitive merchant search, filters by status, sorts amount ascending and descending without mutating `TRANSACTIONS`, and returns all records when filters are empty.

- [ ] **Step 2: Confirm the tests fail**

Run: `npm test -- --no-watch --include='src/interview-practice/01-search-sort/*.spec.ts'`

Expected: FAIL because `SearchSortComponent` does not exist.

- [ ] **Step 3: Implement the component**

Use `query = ''`, `status = 'all'`, and `sortDirection: 'asc' | 'desc' = 'asc'`. Implement filtering with `toLowerCase().includes()`, then sort a copied array with `[...filtered].sort((a, b) => ...)`. The template contains a search input, status select, sort button, result count, empty state, and transaction table.

- [ ] **Step 4: Run the focused tests**

Run the Task 2 command again. Expected: PASS.

### Task 3: Group and aggregate component

**Files:**
- Create: `src/interview-practice/02-group-aggregate/group-aggregate.component.ts`
- Create: `src/interview-practice/02-group-aggregate/group-aggregate.component.html`
- Create: `src/interview-practice/02-group-aggregate/group-aggregate.component.css`
- Create: `src/interview-practice/02-group-aggregate/group-aggregate.component.spec.ts`

- [ ] **Step 1: Write failing aggregation tests**

Assert that `groupByCategory()` returns `{ category, count, totalCents }[]`, combines repeated categories, produces numeric totals in cents, sorts results by total descending, and returns an empty array for empty input.

- [ ] **Step 2: Confirm failure**

Run: `npm test -- --no-watch --include='src/interview-practice/02-group-aggregate/*.spec.ts'`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement one-pass aggregation**

Use `Map<string, { count: number; totalCents: number }>` and a single `for...of` loop. Convert the map to display rows and sort descending. Render a category summary table and explain in a code comment that aggregation is O(n) plus O(k log k) sorting for k categories.

- [ ] **Step 4: Verify focused tests pass**

Run the Task 3 command. Expected: PASS.

### Task 4: Build a nested tree from flat data

**Files:**
- Create: `src/interview-practice/03-build-tree/build-tree.component.ts`
- Create: `src/interview-practice/03-build-tree/build-tree.component.html`
- Create: `src/interview-practice/03-build-tree/build-tree.component.css`
- Create: `src/interview-practice/03-build-tree/build-tree.component.spec.ts`

- [ ] **Step 1: Write failing tree construction tests**

Assert that `buildTree()` creates roots and nested children, accepts children appearing before parents, treats a missing parent as a root, returns `[]` for empty input, and does not mutate input records.

- [ ] **Step 2: Confirm failure**

Run: `npm test -- --no-watch --include='src/interview-practice/03-build-tree/*.spec.ts'`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the O(n) two-pass solution**

First map every flat record to a node with `children: []`. In the second pass, push each node into its parent's `children` when the parent exists; otherwise push it into `roots`. Render the result recursively using a small inline recursive template with `ng-template` and `ngTemplateOutlet`.

- [ ] **Step 4: Verify focused tests pass**

Run the Task 4 command. Expected: PASS.

### Task 5: RxJS debounce component

**Files:**
- Create: `src/interview-practice/04-debounce/debounce.component.ts`
- Create: `src/interview-practice/04-debounce/debounce.component.html`
- Create: `src/interview-practice/04-debounce/debounce.component.css`
- Create: `src/interview-practice/04-debounce/debounce.component.spec.ts`

- [ ] **Step 1: Write failing fake-timer tests**

Use Vitest fake timers. Emit `a`, `ab`, and `abc` rapidly and assert no filtered result changes before 300 ms, only `abc` is processed after 300 ms, and repeated equal queries are ignored by `distinctUntilChanged`.

- [ ] **Step 2: Confirm failure**

Run: `npm test -- --no-watch --include='src/interview-practice/04-debounce/*.spec.ts'`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement debounced filtering**

Create `private readonly querySubject = new Subject<string>()`. In the constructor pipe it through `map(value => value.trim().toLowerCase())`, `debounceTime(300)`, `distinctUntilChanged()`, and `takeUntilDestroyed()`, then update `query` and `results`. The template emits input values through `onQueryChange()` and renders the delayed result list.

- [ ] **Step 4: Verify focused tests pass**

Run the Task 5 command. Expected: PASS.

### Task 6: Fetch state and stale request cancellation

**Files:**
- Create: `src/interview-practice/shared/mock-api.service.ts`
- Create: `src/interview-practice/05-request-state/request-state.component.ts`
- Create: `src/interview-practice/05-request-state/request-state.component.html`
- Create: `src/interview-practice/05-request-state/request-state.component.css`
- Create: `src/interview-practice/05-request-state/request-state.component.spec.ts`

- [ ] **Step 1: Write failing request-state tests**

Mock the service with controlled Subjects. Assert initial idle state, loading after a query, success after emission, empty state for `[]`, error state after an error, and that a second query unsubscribes from the first request.

- [ ] **Step 2: Confirm failure**

Run: `npm test -- --no-watch --include='src/interview-practice/05-request-state/*.spec.ts'`

Expected: FAIL because the service and component do not exist.

- [ ] **Step 3: Implement the mock API**

`search(query: string): Observable<Transaction[]>` uses `defer`; query `error` returns `throwError(() => new Error('Simulated network error')).pipe(delay(500))`, while other queries filter fixtures and return `of(results).pipe(delay(query === 'slow' ? 1500 : 500))`.

- [ ] **Step 4: Implement the RxJS state pipeline**

Use a query Subject, `debounceTime(250)`, `distinctUntilChanged`, and `switchMap`. Set `state = 'loading'` before the request. Map results to success or empty, catch errors inside `switchMap` so the outer stream stays alive, and use `takeUntilDestroyed`. Render explicit idle, loading, empty, error, and success sections plus a retry button.

- [ ] **Step 5: Verify focused tests pass**

Run the Task 6 command. Expected: PASS, including the cancellation assertion.

### Task 7: Interactive list component

**Files:**
- Create: `src/interview-practice/06-interactive-list/interactive-list.component.ts`
- Create: `src/interview-practice/06-interactive-list/interactive-list.component.html`
- Create: `src/interview-practice/06-interactive-list/interactive-list.component.css`
- Create: `src/interview-practice/06-interactive-list/interactive-list.component.spec.ts`

- [ ] **Step 1: Write failing CRUD tests**

Assert that `addTransaction()` trims merchant names, rejects blank names, creates a unique id, stores money as integer cents, and resets inputs. Assert that `toggleStatus()` immutably switches posted and pending, `removeTransaction()` removes only the matching id, and duplicate ids are never produced.

- [ ] **Step 2: Confirm failure**

Run: `npm test -- --no-watch --include='src/interview-practice/06-interactive-list/*.spec.ts'`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the interactive list**

Use normal component fields and immutable array updates. Generate ids from a monotonically increasing counter initialized above the fixture ids. Render an add form, keyed `@for` list, status toggle, delete button, and empty state.

- [ ] **Step 4: Verify focused tests pass**

Run the Task 7 command. Expected: PASS.

### Task 8: Tree traversal component

**Files:**
- Create: `src/interview-practice/07-tree-traversal/tree-traversal.component.ts`
- Create: `src/interview-practice/07-tree-traversal/tree-traversal.component.html`
- Create: `src/interview-practice/07-tree-traversal/tree-traversal.component.css`
- Create: `src/interview-practice/07-tree-traversal/tree-traversal.component.spec.ts`

- [ ] **Step 1: Write failing traversal tests**

Assert that iterative depth-first `findNodeById()` finds roots and deeply nested nodes, returns `undefined` when absent, leaves the tree unchanged, and handles an empty tree. Assert that `flattenTree()` returns pre-order ids.

- [ ] **Step 2: Confirm failure**

Run: `npm test -- --no-watch --include='src/interview-practice/07-tree-traversal/*.spec.ts'`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement traversal and display**

Use a stack initialized with `[...nodes].reverse()`. Pop a node, compare its id, and push reversed children to preserve display order. Implement pre-order flattening with the same stack pattern. Render an id search control, selected-node details, flattened traversal order, and recursive tree display.

- [ ] **Step 4: Verify focused tests pass**

Run the Task 8 command. Expected: PASS.

### Task 9: Interview guide and full verification

**Files:**
- Create: `src/interview-practice/README.md`
- Modify as needed: files created in Tasks 1 through 8

- [ ] **Step 1: Write the rehearsal guide**

For each exercise document the prompt, clarifying questions, approach, important edge cases, and expected complexity. Include the speaking sequence: restate, clarify, propose, code, test, and analyze.

- [ ] **Step 2: Run all tests**

Run: `npm test -- --no-watch`

Expected: all Vitest suites pass.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: build exits 0 with no TypeScript or template errors.

- [ ] **Step 4: Manually verify routes**

Run: `npm start`

Open `/interview-practice`, visit all seven cards, and verify inputs, tables, errors, loading indicators, add/remove actions, and tree rendering.

- [ ] **Step 5: Review scope**

Confirm no signals were introduced, existing `src/coding-round` files were not modified, every exercise is reachable, and every README prompt matches its implementation.
