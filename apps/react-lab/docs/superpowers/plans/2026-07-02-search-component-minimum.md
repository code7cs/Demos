# Minimum Search Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal autocomplete Search component with a controlled input, 500 ms debounced API request, loading indicator, suggestions, and selection callback.

**Architecture:** `Search.tsx` owns rendering and delegates request timing/state to `useSearchSuggestions.ts`. `search.api.ts` isolates the external endpoint. This slice uses native React/browser APIs and defers optional interactions and styling.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, jsdom

---

### Task 1: Prove the minimum behavior

**Files:**
- Create: `src/search/Search.test.tsx`

- [ ] Write a component test that renders the required input.
- [ ] Write a fake-timer test proving fetch starts only after 500 ms.
- [ ] Write tests for loading, suggestion order, and `onSelectItem`.
- [ ] Run `npm test -- src/search/Search.test.tsx` and confirm failure because `Search` does not exist.

### Task 2: Implement the minimum Search slice

**Files:**
- Create: `src/search/search.api.ts`
- Create: `src/search/useSearchSuggestions.ts`
- Create: `src/search/Search.tsx`

- [ ] Implement `fetchSuggestions(query, signal)` against `https://api.frontendeval.com/fake/food/{query}`.
- [ ] Implement a 500 ms effect timer, explicit loading state, and request cancellation.
- [ ] Render the Bulma `control`, `input`, `is-loading`, `list`, and `list-item` contract.
- [ ] Forward the selected suggestion to `onSelectItem`.
- [ ] Run `npm test -- src/search/Search.test.tsx` and confirm all tests pass.

### Task 3: Expose and verify the example

**Files:**
- Modify: `src/routes.tsx`
- Modify: `src/App.tsx`
- Create: `src/search/SearchDemo.tsx`

- [ ] Add a small route that renders `Search` and displays the selected item.
- [ ] Run `npm test` and confirm the full test suite passes.
- [ ] Run `npm run build` and confirm TypeScript and Vite complete successfully.
