# Account Activity Transactions API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Day 2 `getTransactions` function against DummyJSON with deterministic domain mapping, cancellation, and useful error handling.

**Architecture:** `account-activity.store.ts` owns the external DTO, runtime validation, and mapping into the existing `Transaction` model. The component receives only domain transactions and remains independent of DummyJSON. Tests stub the browser `fetch` boundary while exercising the real adapter logic.

**Tech Stack:** TypeScript, browser Fetch API, AbortSignal, Vitest

---

## File structure

- Modify `src/money-lion-account-activity/account-activity.store.ts`: implement the HTTP adapter, response validation, deterministic mapper, and error normalization.
- Create `src/money-lion-account-activity/account-activity.store.test.ts`: cover successful mapping, signal forwarding, HTTP failure, malformed data, and abort preservation.

### Task 1: Define adapter behavior with failing tests

**Files:**
- Create: `src/money-lion-account-activity/account-activity.store.test.ts`
- Test: `src/money-lion-account-activity/account-activity.store.test.ts`

- [ ] **Step 1: Write the successful mapping and signal test**

```typescript
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getTransactions } from './account-activity.store';

describe('getTransactions', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps DummyJSON products and forwards the abort signal', async () => {
    const signal = new AbortController().signal;
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          products: [
            {
              id: 5,
              title: 'Groceries reimbursement',
              price: 25.5,
              category: 'groceries',
              meta: { createdAt: '2026-06-20T12:00:00.000Z' },
            },
            {
              id: 6,
              title: 'Fresh vegetables',
              price: 8.25,
              category: 'groceries',
              meta: { createdAt: '2026-06-20T12:00:00.000Z' },
            },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(getTransactions(signal)).resolves.toEqual([
      {
        id: '5',
        description: 'Cashback: Groceries reimbursement',
        category: 'Income',
        amount: 255,
        date: '2026-06-15T12:00:00.000Z',
      },
      {
        id: '6',
        description: 'Fresh vegetables',
        category: 'Food',
        amount: -8.25,
        date: '2026-06-14T12:00:00.000Z',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=12&delay=700',
      { signal },
    );
  });
});
```

- [ ] **Step 2: Write failure and cancellation tests**

```typescript
it('rejects non-success responses with a user-facing error', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

  await expect(getTransactions()).rejects.toThrow('Unable to load transactions');
});

it('rejects malformed responses with a user-facing error', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ products: [{ id: 1 }] }), { status: 200 }),
    ),
  );

  await expect(getTransactions()).rejects.toThrow('Unable to load transactions');
});

it('preserves AbortError so callers can ignore request cancellation', async () => {
  const abortError = new DOMException('The operation was aborted', 'AbortError');
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

  await expect(getTransactions()).rejects.toBe(abortError);
});
```

- [ ] **Step 3: Run the focused test to verify RED**

Run: `npm test -- src/money-lion-account-activity/account-activity.store.test.ts`

Expected: FAIL because `getTransactions` is currently only declared and has no runtime implementation.

### Task 2: Implement the DummyJSON adapter

**Files:**
- Modify: `src/money-lion-account-activity/account-activity.store.ts`
- Test: `src/money-lion-account-activity/account-activity.store.test.ts`

- [ ] **Step 1: Replace the declaration with the minimal implementation**

```typescript
export type Transaction = {
  id: string;
  description: string;
  category: 'Income' | 'Food' | 'Bills' | 'Shopping';
  amount: number;
  date: string;
};

type DummyProduct = {
  id: number;
  title: string;
  price: number;
  category: string;
  meta: { createdAt: string };
};

const TRANSACTIONS_URL = 'https://dummyjson.com/products?limit=12&delay=700';
const LOAD_ERROR = 'Unable to load transactions';

function isDummyProduct(value: unknown): value is DummyProduct {
  if (!value || typeof value !== 'object') return false;
  const product = value as Record<string, unknown>;
  const meta = product.meta;

  return (
    typeof product.id === 'number' &&
    typeof product.title === 'string' &&
    typeof product.price === 'number' &&
    typeof product.category === 'string' &&
    !!meta &&
    typeof meta === 'object' &&
    typeof (meta as Record<string, unknown>).createdAt === 'string'
  );
}

function categoryFor(product: DummyProduct): Transaction['category'] {
  if (product.id % 5 === 0) return 'Income';
  if (product.category === 'groceries') return 'Food';
  if (['furniture', 'home-decoration', 'kitchen-accessories'].includes(product.category)) {
    return 'Bills';
  }
  return 'Shopping';
}

function mapProduct(product: DummyProduct): Transaction {
  const category = categoryFor(product);
  const date = new Date(product.meta.createdAt);
  date.setUTCDate(date.getUTCDate() - product.id);

  return {
    id: String(product.id),
    description: category === 'Income' ? `Cashback: ${product.title}` : product.title,
    category,
    amount: category === 'Income' ? product.price * 10 : -product.price,
    date: date.toISOString(),
  };
}

function isAbortError(error: unknown): boolean {
  return !!error && typeof error === 'object' && 'name' in error && error.name === 'AbortError';
}

export async function getTransactions(signal?: AbortSignal): Promise<Transaction[]> {
  try {
    const response = await fetch(TRANSACTIONS_URL, { signal });
    if (!response.ok) throw new Error(LOAD_ERROR);

    const body: unknown = await response.json();
    if (!body || typeof body !== 'object' || !('products' in body)) {
      throw new Error(LOAD_ERROR);
    }

    const products = (body as { products: unknown }).products;
    if (!Array.isArray(products) || !products.every(isDummyProduct)) {
      throw new Error(LOAD_ERROR);
    }

    return products.map(mapProduct);
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new Error(LOAD_ERROR);
  }
}
```

- [ ] **Step 2: Run the focused test to verify GREEN**

Run: `npm test -- src/money-lion-account-activity/account-activity.store.test.ts`

Expected: PASS with 4 passing tests.

- [ ] **Step 3: Run the project verification suite**

Run: `npm test`

Expected: all Vitest suites pass.

Run: `npm run build`

Expected: TypeScript compilation and Vite production build exit successfully.

- [ ] **Step 4: Review the diff without committing unrelated work**

Run: `git diff -- src/money-lion-account-activity/account-activity.store.ts src/money-lion-account-activity/account-activity.store.test.ts`

Expected: only the adapter implementation and its tests appear. Do not commit because the working tree already contains unrelated staged changes.
