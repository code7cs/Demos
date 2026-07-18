# Offer Explorer SRP Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor Offer Explorer into a production-style, single-responsibility React feature with simulated asynchronous loading, deterministic errors, retry, cancellation, focused views, and tested selection behavior.

**Architecture:** Keep the feature self-contained. Pure domain/query modules own business rules, an injected repository owns data access, `useOfferExplorer` owns async and interaction orchestration, and small view modules render typed props. Selection is cleared synchronously by filter commands when the next result set hides the selected offer.

**Tech Stack:** React 19, TypeScript 5.9, Vitest 3, JSDOM, Vite 6, plain CSS

---

## File Map

- Create `src/money-lion-offer-explorer/offer.types.ts`: domain and filter types/defaults.
- Create `src/money-lion-offer-explorer/offers.fixture.ts`: immutable demo records.
- Create `src/money-lion-offer-explorer/offer.query.ts`: pure filtering, sorting, categories, and active-filter rules.
- Create `src/money-lion-offer-explorer/offer.query.test.ts`: query-policy tests.
- Create `src/money-lion-offer-explorer/offer.repository.ts`: repository interface and simulated async adapter.
- Create `src/money-lion-offer-explorer/offer.repository.test.ts`: repository lifecycle tests.
- Create `src/money-lion-offer-explorer/useOfferExplorer.ts`: async and interaction orchestration.
- Create `src/money-lion-offer-explorer/offer-explorer.views.tsx`: focused filters, list/card, details, loading, and error views.
- Create `src/money-lion-offer-explorer/offer-explorer.test.tsx`: feature integration tests.
- Modify `src/money-lion-offer-explorer/offer-explorer.tsx`: composition module only.
- Modify `src/money-lion-offer-explorer/offer-explorer.css`: loading/error styles and retry focus styling.
- Delete `src/money-lion-offer-explorer/offer-explorer.store.ts`: responsibilities move to the files above.

### Task 1: Extract and test pure offer-query policy

**Files:**
- Create: `src/money-lion-offer-explorer/offer.types.ts`
- Create: `src/money-lion-offer-explorer/offers.fixture.ts`
- Create: `src/money-lion-offer-explorer/offer.query.ts`
- Test: `src/money-lion-offer-explorer/offer.query.test.ts`

- [ ] **Step 1: Write the failing query tests**

Create tests using a three-offer local fixture. Assert that `queryOffers` trims and lowercases search input, combines filters, sorts title and APR with null last, and leaves its input unchanged. Assert `getOfferCategories` removes duplicates and `hasActiveOfferFilters` treats whitespace-only search as inactive.

```ts
import { describe, expect, it } from 'vitest';
import {
  getOfferCategories,
  hasActiveOfferFilters,
  queryOffers,
} from './offer.query';
import { DEFAULT_OFFER_FILTERS, type Offer } from './offer.types';

const offers: Offer[] = [
  { id: '1', title: 'Zulu Loan', category: 'Personal Loan', apr: 12.5, recommended: false },
  { id: '2', title: 'Alpha Builder', category: 'Credit Builder', apr: 3.5, recommended: true },
  { id: '3', title: 'Instant Cash', category: 'Cash Advance', apr: null, recommended: true },
];

describe('offer query policy', () => {
  it('normalizes search and combines filters without mutating input', () => {
    const original = [...offers];
    const result = queryOffers(offers, {
      ...DEFAULT_OFFER_FILTERS,
      searchTerm: '  ALPHA  ',
      category: 'Credit Builder',
      recommendedOnly: true,
    });
    expect(result.map(({ id }) => id)).toEqual(['2']);
    expect(offers).toEqual(original);
  });

  it('sorts APR ascending and places missing APR last', () => {
    expect(queryOffers(offers, { ...DEFAULT_OFFER_FILTERS, sortBy: 'apr' }).map(({ id }) => id))
      .toEqual(['2', '1', '3']);
  });

  it('derives unique categories and recognizes meaningful filters', () => {
    expect(getOfferCategories([...offers, offers[0]])).toEqual([
      'Personal Loan', 'Credit Builder', 'Cash Advance',
    ]);
    expect(hasActiveOfferFilters({ ...DEFAULT_OFFER_FILTERS, searchTerm: '   ' })).toBe(false);
    expect(hasActiveOfferFilters({ ...DEFAULT_OFFER_FILTERS, recommendedOnly: true })).toBe(true);
  });
});
```

- [ ] **Step 2: Run the query tests and verify they fail**

Run: `npm test -- src/money-lion-offer-explorer/offer.query.test.ts`

Expected: FAIL because `offer.query` and `offer.types` do not exist.

- [ ] **Step 3: Implement the types, fixture, and query functions**

Define `OfferCategory`, `Offer`, `OfferSort`, `OfferFilters`, and `DEFAULT_OFFER_FILTERS`. Move the five existing offers into `offers.fixture.ts` as `OFFER_FIXTURES`. Implement `queryOffers` with `filter` followed by sorting a fresh array, `getOfferCategories` with `Set`, and `hasActiveOfferFilters` with trimmed search comparison.

```ts
export type OfferCategory = 'Credit Builder' | 'Personal Loan' | 'Cash Advance';
export type OfferSort = 'title' | 'apr';
export type Offer = {
  id: string;
  title: string;
  category: OfferCategory;
  apr: number | null;
  recommended: boolean;
};
export type OfferFilters = {
  searchTerm: string;
  category: OfferCategory | '';
  recommendedOnly: boolean;
  sortBy: OfferSort;
};
export const DEFAULT_OFFER_FILTERS: OfferFilters = {
  searchTerm: '', category: '', recommendedOnly: false, sortBy: 'title',
};
```

- [ ] **Step 4: Run the query tests**

Run: `npm test -- src/money-lion-offer-explorer/offer.query.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the pure domain/query slice**

```powershell
git add -- src/money-lion-offer-explorer/offer.types.ts src/money-lion-offer-explorer/offers.fixture.ts src/money-lion-offer-explorer/offer.query.ts src/money-lion-offer-explorer/offer.query.test.ts
git commit -m "refactor: extract offer query policy"
```

### Task 2: Add the simulated asynchronous repository

**Files:**
- Create: `src/money-lion-offer-explorer/offer.repository.ts`
- Test: `src/money-lion-offer-explorer/offer.repository.test.ts`

- [ ] **Step 1: Write failing repository lifecycle tests**

Use fake timers. Test delayed cloned results, `failTimes: 1` rejecting once then succeeding, and aborting with an `AbortError` before the delay completes.

```ts
const repository = createSimulatedOfferRepository({ delayMs: 100, failTimes: 1 });
const first = repository.getOffers();
await vi.advanceTimersByTimeAsync(100);
await expect(first).rejects.toThrow('Unable to load offers');
const second = repository.getOffers();
await vi.advanceTimersByTimeAsync(100);
await expect(second).resolves.toHaveLength(5);
```

- [ ] **Step 2: Run the repository test and verify it fails**

Run: `npm test -- src/money-lion-offer-explorer/offer.repository.test.ts`

Expected: FAIL because the repository module does not exist.

- [ ] **Step 3: Implement the repository interface and adapter**

```ts
export type GetOffersOptions = { signal?: AbortSignal };
export interface OfferRepository {
  getOffers(options?: GetOffersOptions): Promise<Offer[]>;
}
export type SimulatedRepositoryOptions = { delayMs?: number; failTimes?: number };
export function createSimulatedOfferRepository(
  { delayMs = 500, failTimes = 0 }: SimulatedRepositoryOptions = {},
): OfferRepository { /* timer, abort cleanup, deterministic attempt counter, cloned records */ }
export const offerRepository = createSimulatedOfferRepository();
```

Reject aborts with `new DOMException('The request was aborted', 'AbortError')`. Remove the abort listener whenever the timer settles. Add a short comment explaining that failure injection is deterministic for demos and tests.

- [ ] **Step 4: Run repository and query tests**

Run: `npm test -- src/money-lion-offer-explorer/offer.repository.test.ts src/money-lion-offer-explorer/offer.query.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the repository slice**

```powershell
git add -- src/money-lion-offer-explorer/offer.repository.ts src/money-lion-offer-explorer/offer.repository.test.ts
git commit -m "feat: add simulated offer repository"
```

### Task 3: Build and integrate the orchestration hook

**Files:**
- Create: `src/money-lion-offer-explorer/useOfferExplorer.ts`
- Test: `src/money-lion-offer-explorer/offer-explorer.test.tsx`

- [ ] **Step 1: Write failing integration tests for request state and selection**

Render `OfferExplorer` with an injected repository. Use deferred promises to assert the loading status, successful results, error alert, retry, selection details, and selection clearing after changing the category. Dispatch native `input`, `change`, and `click` events inside `act`, following `src/search/Search.test.tsx`.

```tsx
act(() => root.render(<OfferExplorer repository={repository} />));
expect(container.querySelector('[role="status"]')?.textContent).toContain('Loading offers');
// Resolve, select "Flexible Personal Loan", then change category to Credit Builder.
expect(container.querySelector('.offer-details')?.textContent).toContain('Offer details');
expect(container.querySelector('.offer-details')?.textContent).not.toContain('Flexible Personal Loan');
```

- [ ] **Step 2: Run the integration tests and verify they fail**

Run: `npm test -- src/money-lion-offer-explorer/offer-explorer.test.tsx`

Expected: FAIL because injection, request states, and selection clearing are absent.

- [ ] **Step 3: Implement `useOfferExplorer`**

Accept an `OfferRepository`. Fetch in an effect with `AbortController`, ignore `AbortError`, expose a retry counter, and derive visible offers/categories. Implement a single `applyFilters(nextFilters)` helper that queries the next result set and clears `selectedOfferId` only when that ID will no longer be visible. Expose typed field commands that call this helper, plus `resetFilters`, `selectOffer`, and `retry`.

The view model must expose:

```ts
{
  status, errorMessage, filters, offers, categories, selectedOffer,
  hasActiveFilters, setSearchTerm, setCategory, setRecommendedOnly,
  setSortBy, resetFilters, selectOffer, retry,
}
```

- [ ] **Step 4: Run the integration test to verify hook behavior**

Run: `npm test -- src/money-lion-offer-explorer/offer-explorer.test.tsx`

Expected: Tests progress past async-state assertions; rendering assertions may remain failing until Task 4.

- [ ] **Step 5: Commit the orchestration slice with its integration test scaffold**

```powershell
git add -- src/money-lion-offer-explorer/useOfferExplorer.ts src/money-lion-offer-explorer/offer-explorer.test.tsx
git commit -m "feat: orchestrate offer explorer state"
```

### Task 4: Extract focused views and make the integration tests pass

**Files:**
- Create: `src/money-lion-offer-explorer/offer-explorer.views.tsx`
- Modify: `src/money-lion-offer-explorer/offer-explorer.tsx`
- Modify: `src/money-lion-offer-explorer/offer-explorer.css`
- Delete: `src/money-lion-offer-explorer/offer-explorer.store.ts`
- Modify: `src/money-lion-offer-explorer/offer-explorer.test.tsx`

- [ ] **Step 1: Extract the focused view modules**

Move existing markup without changing labels or class names. Export `OfferFilters`, `OfferList`, `OfferCard`, `OfferDetails`, `OfferLoading`, and `OfferError`. Give each module explicit typed props; no module may import the repository or query functions.

- [ ] **Step 2: Reduce the page to composition**

`OfferExplorer` accepts `repository: OfferRepository = offerRepository`, invokes the hook, renders the existing header, branches on `status`, and passes view-model values/commands to the focused views.

```tsx
export default function OfferExplorer({ repository = offerRepository }: OfferExplorerProps) {
  const explorer = useOfferExplorer(repository);
  return (
    <main className="offer-explorer">
      {/* existing header */}
      {explorer.status === 'loading' && <OfferLoading />}
      {explorer.status === 'error' && <OfferError message={explorer.errorMessage} onRetry={explorer.retry} />}
      {explorer.status === 'success' && (/* filters + list/details composition */)}
    </main>
  );
}
```

- [ ] **Step 3: Add loading/error styles and delete the obsolete store**

Add `.offer-request-state` presentation, include its retry button in the existing button and focus selectors, and delete `offer-explorer.store.ts` after all imports have moved.

- [ ] **Step 4: Run all Offer Explorer tests**

Run: `npm test -- src/money-lion-offer-explorer`

Expected: query, repository, and integration tests all PASS with no React `act` warnings.

- [ ] **Step 5: Commit the composed feature**

```powershell
git add -- src/money-lion-offer-explorer
git commit -m "refactor: split offer explorer responsibilities"
```

### Task 5: Verify the complete repository

**Files:**
- Modify only if verification exposes an Offer Explorer defect.

- [ ] **Step 1: Run formatting check on changed files**

Run: `npx prettier --check "src/money-lion-offer-explorer/**/*.{ts,tsx,css}"`

Expected: all files use Prettier formatting. If needed, run the same command with `--write`, then rerun `--check`.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite build successfully.

- [ ] **Step 4: Check the final diff and workspace isolation**

Run: `git diff --check` and `git status --short`.

Expected: no whitespace errors; pre-existing changes in `src/App.tsx`, `src/routes.tsx`, and `src/shipment-exception-queue/` remain untouched.

- [ ] **Step 5: Commit any verification-only corrections**

If Task 5 required Offer Explorer corrections, stage only `src/money-lion-offer-explorer` and commit:

```powershell
git add -- src/money-lion-offer-explorer
git commit -m "fix: complete offer explorer verification"
```
