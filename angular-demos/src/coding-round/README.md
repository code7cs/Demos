# Coding Round — Transaction Search UI

**Route:** `/coding-round/transaction-search`

Practice target for Capital One Power Day **frontend coding round** (not the system design `bank-system` demo).

## What this exercises

- Blank-screen friendly structure: models → API service → store → dumb components → page shell
- Search + status filter
- Sortable columns (merchant, date, amount)
- Client-side pagination (page size 5)
- Loading skeleton, error + retry, empty state
- Standalone Angular 21 + signals + OnPush

## 3-level interview progression

Rebuild from scratch in this order if you are practicing for CodeSignal:

### Level 1 — Display data
1. Define `Transaction` model.
2. Create mock API service with `fetchTransactions()` + artificial delay.
3. Render a table with merchant, description, status, date, amount.

### Level 2 — Search and filter
1. Add search input and status dropdown.
2. Filter in store; reset page index when filters change.
3. Show empty state when no rows match.

### Level 3 — Sort, pagination, async states
1. Add sortable headers and toggle asc/desc.
2. Paginate filtered + sorted results.
3. Add loading skeleton, error banner with retry.

## How to run

```bash
cd ~/code/Demos/angular-demos
npm start
```

Open: http://localhost:4200/coding-round/transaction-search

## Talk track while coding

1. Clarify requirements: which columns, filter fields, page size, async API?
2. Start with data model and mock API.
3. Build store with signals + computed page result.
4. Extract dumb table/toolbar/pagination components.
5. Wire loading/error/empty last.
6. Mention tradeoffs: client-side filter/sort is fine for small lists; production would server-paginate.

## File map

```text
coding-round/
  models/transaction.models.ts
  data-access/transaction-api.service.ts
  state/transaction-search.store.ts
  components/search-toolbar/
  components/transaction-table/
  components/pagination/
  transaction-search.component.*
```
