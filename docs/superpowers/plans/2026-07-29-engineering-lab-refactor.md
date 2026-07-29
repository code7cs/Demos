# Engineering Lab Repository Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `code7cs/Demos` into a recruiter-friendly engineering lab centered on React and frontend architecture, with a maintained Angular application, consistent experiment discovery, documented quality standards, and a clearly separated archive.

**Architecture:** The root becomes an npm workspace whose maintained surface is `apps/react-lab` and `apps/angular-lab`. React Lab owns a typed experiment registry and catalog module; individual experiments remain focused modules grouped by engineering concept. Historical projects move into documented archive categories and remain outside workspace installation and CI.

**Tech Stack:** npm workspaces, React 19, React Router 7, TypeScript 5.9, Vite 6, Vitest 3, Angular 21, GitHub Actions.

---

## File Map

### Root

- `package.json` — workspace interface and root build/test/format commands.
- `package-lock.json` — single lockfile for maintained workspaces.
- `README.md` — recruiter-facing repository entry point.
- `.github/workflows/quality.yml` — CI for the maintained workspace only.
- `.gitignore` — generated files, editor artifacts, and temporary merge files.

### React Lab

- `apps/react-lab/src/lab/experiment.types.ts` — experiment interface and supported categories.
- `apps/react-lab/src/lab/experiment.registry.ts` — single catalog metadata source.
- `apps/react-lab/src/lab/experiment.registry.test.ts` — metadata invariants.
- `apps/react-lab/src/lab/experiment.routes.tsx` — route adapters for experiment implementations.
- `apps/react-lab/src/lab/experiment.routes.test.ts` — route/registry parity.
- `apps/react-lab/src/lab/catalog.ts` — pure search/filter behavior.
- `apps/react-lab/src/lab/catalog.test.ts` — catalog behavior tests.
- `apps/react-lab/src/lab/LabHome.tsx` — recruiter-facing experiment catalog.
- `apps/react-lab/src/lab/LabHome.css` — responsive catalog presentation.
- `apps/react-lab/src/lab/LabShell.tsx` — global header and responsive navigation.
- `apps/react-lab/src/lab/LabShell.css` — shared application shell.
- `apps/react-lab/src/routes.tsx` — home, registered experiment routes, and fallback.
- `apps/react-lab/src/App.tsx` — composes the Lab shell with routes.

### Documentation

- `docs/experiment-standard.md` — required problem, decisions, verification, and production notes.
- `docs/architecture/react-lab.md` — registry seam, routing adapter, and experiment ownership.
- `archive/README.md` — archive purpose and maintenance policy.

## Archive Mapping

Move tracked directories using `git mv`:

```text
archive/legacy-angular/
  Angular-Material
  AngularCRUD
  ComponentHooks
  lifecycle-hooks
  mock-app
  ng-demo
  ngrx-store-counter
  ngrx-store-demo

archive/tutorials/
  Calculator-HTML
  changeOrder
  delegation
  demo
  deno-jumpstart
  domContentLoaded
  Event_preventDefault
  Event_Propagation
  infinite-page-scrolling
  Learn-GraphQL
  NodeJS
  sundey
  vanilaJSProjects
  webFullStack

archive/interview-exercises/
  GoldMan-Sachs
  interview-prapare-2022
  Lab
  Mock
  Practice
  T-mobile

archive/algorithms/
  leetcode
  leetcode-ts

archive/miscellaneous/
  Node-URL-Shortener-Service-main
  rest-service
  Shoppingview
```

`apps/react-lab`, `apps/angular-lab`, `docs`, `.github`, and root configuration remain in the maintained surface.

---

### Task 1: Establish a Verified Baseline

**Files:**
- Read: `react-demos/package.json`
- Read: `angular-demos/package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Record the current worktree without staging unrelated files**

Run:

```bash
git status --short
```

Expected: the existing `react-demos/src/nested-comments/NestedComments.test.tsx.orig` and `vanilaJSProjects/.vscode/` remain untracked. Do not add them.

- [ ] **Step 2: Run the current React verification**

Run:

```bash
npm test --prefix react-demos
npm run build --prefix react-demos
```

Expected: both commands exit `0`. If either fails, record the exact pre-existing failure before continuing.

- [ ] **Step 3: Run the current Angular verification**

Run:

```bash
npm test --prefix angular-demos -- --watch=false
npm run build --prefix angular-demos
```

Expected: both commands exit `0`. If Angular's test runner rejects `--watch=false`, run `npm test --prefix angular-demos` and record its non-watch behavior before changing scripts.

- [ ] **Step 4: Ignore accidental temporary and editor files**

Append these rules to `.gitignore`:

```gitignore
# Local editor and merge artifacts
.vscode/
*.orig
*.rej
```

Remove the narrower `leetcode-ts/.vscode/` rule because the root `.vscode/` rule supersedes it.

- [ ] **Step 5: Verify the ignore boundary**

Run:

```bash
git status --short
git check-ignore -v react-demos/src/nested-comments/NestedComments.test.tsx.orig
git check-ignore -v vanilaJSProjects/.vscode/settings.json
```

Expected: only `.gitignore` appears as a new tracked change, and both local artifacts report the new root rules.

- [ ] **Step 6: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore local editor artifacts"
```

### Task 2: Create the Maintained Workspace

**Files:**
- Modify: `package.json`
- Regenerate: `package-lock.json`
- Move: `react-demos` → `apps/react-lab`
- Move: `angular-demos` → `apps/angular-lab`

- [ ] **Step 1: Move maintained applications without changing their implementations**

Run:

```bash
mkdir -p apps
git mv react-demos apps/react-lab
git mv angular-demos apps/angular-lab
```

Expected: Git reports renames and no application source deletion.

- [ ] **Step 2: Replace the root workspace interface**

Replace `package.json` with:

```json
{
  "name": "code7cs-engineering-lab",
  "private": true,
  "version": "1.0.0",
  "workspaces": [
    "apps/react-lab",
    "apps/angular-lab"
  ],
  "scripts": {
    "dev:react": "npm run dev --workspace react-lab",
    "dev:angular": "npm run start --workspace angular-lab",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "prettier": "^3.8.1"
  }
}
```

- [ ] **Step 3: Align workspace package names and test modes**

In `apps/react-lab/package.json`, change only the name:

```json
"name": "react-lab"
```

In `apps/angular-lab/package.json`, change the name and make CI tests finite:

```json
"name": "angular-lab",
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test --watch=false"
}
```

- [ ] **Step 4: Generate one workspace lockfile**

Run:

```bash
rm apps/react-lab/package-lock.json
rm apps/angular-lab/package-lock.json
npm install
```

Expected: root `package-lock.json` contains both workspace package names and npm installs dependencies successfully.

- [ ] **Step 5: Verify root commands**

Run:

```bash
npm run build
npm test
```

Expected: both workspaces build and test successfully from the root.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json apps
git commit -m "refactor: establish maintained app workspaces"
```

### Task 3: Introduce the Typed Experiment Registry

**Files:**
- Create: `apps/react-lab/src/lab/experiment.types.ts`
- Create: `apps/react-lab/src/lab/experiment.registry.ts`
- Test: `apps/react-lab/src/lab/experiment.registry.test.ts`

- [ ] **Step 1: Write the failing registry invariant tests**

Create `apps/react-lab/src/lab/experiment.registry.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { experiments } from './experiment.registry';

describe('experiment registry', () => {
  it('uses unique slugs and routes', () => {
    const slugs = experiments.map(({ slug }) => slug);
    const routes = experiments.map(({ route }) => route);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it('provides recruiter-facing metadata for every experiment', () => {
    for (const experiment of experiments) {
      expect(experiment.title.trim()).not.toBe('');
      expect(experiment.summary.trim().length).toBeGreaterThanOrEqual(40);
      expect(experiment.technologies.length).toBeGreaterThan(0);
      expect(experiment.concepts.length).toBeGreaterThan(0);
      expect(experiment.route).toBe(`/experiments/${experiment.slug}`);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test --workspace react-lab -- src/lab/experiment.registry.test.ts
```

Expected: FAIL because `experiment.registry` does not exist.

- [ ] **Step 3: Create the experiment types**

Create `apps/react-lab/src/lab/experiment.types.ts`:

```ts
export const experimentCategories = [
  'architecture',
  'state-and-data-flow',
  'async-workflows',
  'ux-and-quality',
  'full-stack',
] as const;

export type ExperimentCategory = (typeof experimentCategories)[number];
export type ExperimentStatus = 'stable' | 'exploring';

export type ExperimentDefinition = {
  slug: string;
  title: string;
  summary: string;
  category: ExperimentCategory;
  technologies: string[];
  concepts: string[];
  status: ExperimentStatus;
  route: `/experiments/${string}`;
  featured: boolean;
};
```

- [ ] **Step 4: Create the registry**

Create `apps/react-lab/src/lab/experiment.registry.ts` with one entry for each current route:

```ts
import type { ExperimentDefinition } from './experiment.types';

export const experiments = [
  {
    slug: 'nested-comments',
    title: 'Nested Comments',
    summary: 'Model recursive discussion threads with immutable tree updates and focused interaction states.',
    category: 'architecture',
    technologies: ['React', 'TypeScript', 'Vitest'],
    concepts: ['recursive UI', 'immutable updates', 'component boundaries'],
    status: 'stable',
    route: '/experiments/nested-comments',
    featured: true,
  },
  {
    slug: 'shipment-exception-queue',
    title: 'Shipment Exception Queue',
    summary: 'Coordinate filtering, selection, and resolution workflows for an operations-focused interface.',
    category: 'async-workflows',
    technologies: ['React', 'TypeScript', 'Vitest'],
    concepts: ['workflow state', 'derived data', 'master-detail UI'],
    status: 'stable',
    route: '/experiments/shipment-exception-queue',
    featured: true,
  },
  {
    slug: 'search',
    title: 'Resilient Search',
    summary: 'Explore debounced suggestions, request cancellation, stale responses, and recoverable API failures.',
    category: 'async-workflows',
    technologies: ['React', 'TypeScript', 'Fetch API'],
    concepts: ['debouncing', 'cancellation', 'race conditions'],
    status: 'stable',
    route: '/experiments/search',
    featured: true,
  },
  {
    slug: 'offer-explorer',
    title: 'Offer Explorer',
    summary: 'Separate querying, repository access, and presentation while keeping product filtering understandable.',
    category: 'architecture',
    technologies: ['React', 'TypeScript', 'Vitest'],
    concepts: ['deep modules', 'repository adapter', 'query model'],
    status: 'stable',
    route: '/experiments/offer-explorer',
    featured: true,
  },
  {
    slug: 'account-activity',
    title: 'Account Activity',
    summary: 'Represent account events through explicit state transitions and predictable derived balances.',
    category: 'state-and-data-flow',
    technologies: ['React', 'TypeScript'],
    concepts: ['state transitions', 'derived state', 'data modeling'],
    status: 'exploring',
    route: '/experiments/account-activity',
    featured: true,
  },
  {
    slug: 'undoable-counter',
    title: 'Undoable Counter',
    summary: 'Demonstrate reversible commands and bounded history through a deliberately small state model.',
    category: 'state-and-data-flow',
    technologies: ['React', 'TypeScript', 'Vitest'],
    concepts: ['undo-redo', 'state history', 'pure state'],
    status: 'stable',
    route: '/experiments/undoable-counter',
    featured: false,
  },
  {
    slug: 'bank-system',
    title: 'Banking State Model',
    summary: 'Keep monetary transitions deterministic while separating domain rules from interface interactions.',
    category: 'state-and-data-flow',
    technologies: ['React', 'TypeScript'],
    concepts: ['domain rules', 'state machine', 'validation'],
    status: 'exploring',
    route: '/experiments/bank-system',
    featured: false,
  },
  {
    slug: 'crypto-converter',
    title: 'Crypto Converter',
    summary: 'Coordinate remote exchange data, input state, and conversion results through a focused store.',
    category: 'async-workflows',
    technologies: ['React', 'TypeScript', 'Fetch API'],
    concepts: ['remote data', 'derived values', 'error states'],
    status: 'exploring',
    route: '/experiments/crypto-converter',
    featured: false,
  },
  {
    slug: 'memory-game',
    title: 'Memory Game',
    summary: 'Model matching rules, turn boundaries, and reset behavior as deterministic game transitions.',
    category: 'ux-and-quality',
    technologies: ['React', 'TypeScript'],
    concepts: ['interaction design', 'game state', 'deterministic logic'],
    status: 'exploring',
    route: '/experiments/memory-game',
    featured: false,
  },
  {
    slug: 'wordle',
    title: 'Word Puzzle',
    summary: 'Separate puzzle evaluation from keyboard interactions and present feedback through accessible states.',
    category: 'ux-and-quality',
    technologies: ['React', 'TypeScript', 'Vitest'],
    concepts: ['pure logic', 'keyboard input', 'accessible feedback'],
    status: 'stable',
    route: '/experiments/wordle',
    featured: false,
  },
] satisfies ExperimentDefinition[];
```

- [ ] **Step 5: Run the registry tests**

Run:

```bash
npm test --workspace react-lab -- src/lab/experiment.registry.test.ts
```

Expected: PASS with two tests.

- [ ] **Step 6: Commit**

```bash
git add apps/react-lab/src/lab
git commit -m "feat: define typed experiment registry"
```

### Task 4: Make Routes Consume the Registry Contract

**Files:**
- Create: `apps/react-lab/src/lab/experiment.routes.tsx`
- Test: `apps/react-lab/src/lab/experiment.routes.test.ts`
- Modify: `apps/react-lab/src/routes.tsx`

- [ ] **Step 1: Write a failing parity test**

Create `apps/react-lab/src/lab/experiment.routes.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { experiments } from './experiment.registry';
import { experimentRoutes } from './experiment.routes';

describe('experiment routes', () => {
  it('provides exactly one implementation adapter per registry entry', () => {
    expect(experimentRoutes.map(({ path }) => path).sort()).toEqual(
      experiments.map(({ route }) => route).sort(),
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test --workspace react-lab -- src/lab/experiment.routes.test.ts
```

Expected: FAIL because `experiment.routes` does not exist.

- [ ] **Step 3: Create route adapters**

Create `apps/react-lab/src/lab/experiment.routes.tsx`:

```tsx
import type { ReactNode } from 'react';
import BankSystemDemo from '../bank-system/BankSystemDemo';
import CryptoConverter from '../crypto-converter/CryptoConverter';
import MemoryGame from '../memory-game/MemoryGame';
import AccountActivity from '../money-lion-account-activity/account-activity';
import OfferExplorer from '../money-lion-offer-explorer/offer-explorer';
import NestedCommentsDemo from '../nested-comments/NestedCommentsDemo';
import SearchDemo from '../search/SearchDemo';
import ShipmentExceptionQueue from '../shipment-exception-queue/ShipmentExceptionQueue';
import UndoableCounter from '../undoable-counter/UndoableCounter';
import Wordle from '../wordle/Wordle';
import type { ExperimentDefinition } from './experiment.types';

type ExperimentRoute = {
  path: ExperimentDefinition['route'];
  element: ReactNode;
};

export const experimentRoutes: ExperimentRoute[] = [
  { path: '/experiments/nested-comments', element: <NestedCommentsDemo /> },
  { path: '/experiments/shipment-exception-queue', element: <ShipmentExceptionQueue /> },
  { path: '/experiments/search', element: <SearchDemo /> },
  { path: '/experiments/offer-explorer', element: <OfferExplorer /> },
  { path: '/experiments/account-activity', element: <AccountActivity /> },
  { path: '/experiments/undoable-counter', element: <UndoableCounter /> },
  { path: '/experiments/bank-system', element: <BankSystemDemo /> },
  { path: '/experiments/crypto-converter', element: <CryptoConverter /> },
  { path: '/experiments/memory-game', element: <MemoryGame /> },
  { path: '/experiments/wordle', element: <Wordle /> },
];
```

- [ ] **Step 4: Update route composition**

Replace `apps/react-lab/src/routes.tsx` with:

```tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import LabHome from './lab/LabHome';
import { experimentRoutes } from './lab/experiment.routes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LabHome />} />
      {experimentRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

Create a temporary `apps/react-lab/src/lab/LabHome.tsx`:

```tsx
export default function LabHome() {
  return <h1>Engineering Lab</h1>;
}
```

- [ ] **Step 5: Verify tests and build**

Run:

```bash
npm test --workspace react-lab -- src/lab/experiment.routes.test.ts
npm run build --workspace react-lab
```

Expected: parity test and build pass.

- [ ] **Step 6: Commit**

```bash
git add apps/react-lab/src/lab apps/react-lab/src/routes.tsx
git commit -m "refactor: route experiments through registry contract"
```

### Task 5: Build Searchable Catalog Behavior

**Files:**
- Create: `apps/react-lab/src/lab/catalog.ts`
- Test: `apps/react-lab/src/lab/catalog.test.ts`
- Modify: `apps/react-lab/src/lab/LabHome.tsx`
- Create: `apps/react-lab/src/lab/LabHome.css`

- [ ] **Step 1: Write failing pure catalog tests**

Create `apps/react-lab/src/lab/catalog.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { experiments } from './experiment.registry';
import { filterExperiments } from './catalog';

describe('filterExperiments', () => {
  it('searches titles, summaries, technologies, and concepts case-insensitively', () => {
    expect(filterExperiments(experiments, { query: 'RACE CONDITIONS', category: 'all' }))
      .toHaveLength(1);
    expect(filterExperiments(experiments, { query: 'repository', category: 'all' })[0]?.slug)
      .toBe('offer-explorer');
    expect(filterExperiments(experiments, { query: 'fetch api', category: 'all' }))
      .toHaveLength(2);
  });

  it('combines category and text filters', () => {
    const result = filterExperiments(experiments, {
      query: 'state',
      category: 'state-and-data-flow',
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(({ category }) => category === 'state-and-data-flow')).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test --workspace react-lab -- src/lab/catalog.test.ts
```

Expected: FAIL because `catalog` does not exist.

- [ ] **Step 3: Implement the pure catalog module**

Create `apps/react-lab/src/lab/catalog.ts`:

```ts
import type { ExperimentCategory, ExperimentDefinition } from './experiment.types';

export type CatalogFilters = {
  query: string;
  category: ExperimentCategory | 'all';
};

export function filterExperiments(
  source: ExperimentDefinition[],
  filters: CatalogFilters,
): ExperimentDefinition[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return source.filter((experiment) => {
    const matchesCategory =
      filters.category === 'all' || experiment.category === filters.category;
    const searchable = [
      experiment.title,
      experiment.summary,
      ...experiment.technologies,
      ...experiment.concepts,
    ]
      .join(' ')
      .toLocaleLowerCase();

    return matchesCategory && (query === '' || searchable.includes(query));
  });
}
```

- [ ] **Step 4: Run the catalog tests**

Run:

```bash
npm test --workspace react-lab -- src/lab/catalog.test.ts
```

Expected: PASS.

- [ ] **Step 5: Implement the catalog UI**

Replace `apps/react-lab/src/lab/LabHome.tsx` with a component that:

- initializes `query` to `''` and `category` to `'all'`;
- renders the positioning statement from the spec;
- renders featured cards from `experiments.filter(({ featured }) => featured)`;
- renders an accessible search input labeled `Search experiments`;
- renders one filter button for `all` plus each `experimentCategories` value;
- renders cards from `filterExperiments(experiments, { query, category })`;
- uses `<Link to={experiment.route}>` for every card;
- displays an empty-state message and a button that resets both filters.

Use this card content order:

```tsx
<article className="experiment-card">
  <p className="experiment-card__category">{formatCategory(experiment.category)}</p>
  <h3><Link to={experiment.route}>{experiment.title}</Link></h3>
  <p>{experiment.summary}</p>
  <ul aria-label={`${experiment.title} technologies`}>
    {experiment.technologies.map((technology) => <li key={technology}>{technology}</li>)}
  </ul>
</article>
```

Create `apps/react-lab/src/lab/LabHome.css` with:

- a maximum content width of `72rem`;
- a responsive `repeat(auto-fit, minmax(17rem, 1fr))` card grid;
- visible focus states using `:focus-visible`;
- filter buttons with pressed and hover states;
- a single restrained blue/indigo accent system;
- no required animation;
- a reduced-motion rule for any optional transitions.

- [ ] **Step 6: Verify catalog behavior**

Run:

```bash
npm test --workspace react-lab
npm run build --workspace react-lab
```

Expected: all React tests and the production build pass.

- [ ] **Step 7: Commit**

```bash
git add apps/react-lab/src/lab
git commit -m "feat: add searchable engineering experiment catalog"
```

### Task 6: Replace the Flat Navigation with a Lab Shell

**Files:**
- Create: `apps/react-lab/src/lab/LabShell.tsx`
- Create: `apps/react-lab/src/lab/LabShell.css`
- Modify: `apps/react-lab/src/App.tsx`
- Delete: `apps/react-lab/src/App.css`
- Delete: `apps/react-lab/src/home/Home.tsx`
- Delete: `apps/react-lab/src/home/Home.css`

- [ ] **Step 1: Create the shared shell**

Create `apps/react-lab/src/lab/LabShell.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LabShell.css';

type LabShellProps = {
  children: ReactNode;
};

export default function LabShell({ children }: LabShellProps) {
  const { pathname } = useLocation();
  const isCatalog = pathname === '/';

  return (
    <>
      <header className="lab-header">
        <Link className="lab-brand" to="/">
          <span>Hanfan Wang</span>
          <strong>Engineering Lab</strong>
        </Link>
        {!isCatalog && <Link to="/">All experiments</Link>}
      </header>
      <main id="main-content">{children}</main>
    </>
  );
}
```

- [ ] **Step 2: Compose the shell**

Replace `apps/react-lab/src/App.tsx` with:

```tsx
import LabShell from './lab/LabShell';
import AppRoutes from './routes';

export default function App() {
  return (
    <LabShell>
      <AppRoutes />
    </LabShell>
  );
}
```

- [ ] **Step 3: Add shell styles**

Create `apps/react-lab/src/lab/LabShell.css` with:

- a sticky but compact header;
- the same `72rem` content alignment as the catalog;
- a two-line brand that does not compete with the home-page heading;
- visible keyboard focus;
- mobile wrapping below `40rem`;
- colors expressed through root custom properties.

Move shared color, typography, background, and focus custom properties into `apps/react-lab/src/styles.css`.

- [ ] **Step 4: Remove superseded navigation files**

Run:

```bash
git rm apps/react-lab/src/App.css
git rm -r apps/react-lab/src/home
```

- [ ] **Step 5: Verify navigation and fallback**

Run:

```bash
npm test --workspace react-lab
npm run build --workspace react-lab
```

Manual verification:

```text
/                              displays catalog
/experiments/nested-comments   displays experiment and "All experiments"
/does-not-exist                redirects to catalog
```

- [ ] **Step 6: Commit**

```bash
git add apps/react-lab/src
git commit -m "refactor: introduce focused React Lab shell"
```

### Task 7: Group React Experiments by Engineering Concept

**Files:**
- Move: current experiment directories under `apps/react-lab/src/experiments/<category>/`
- Modify: `apps/react-lab/src/lab/experiment.routes.tsx`

- [ ] **Step 1: Move experiment modules without editing their internals**

Run:

```bash
mkdir -p apps/react-lab/src/experiments/{architecture,state-and-data-flow,async-workflows,ux-and-quality,full-stack}
git mv apps/react-lab/src/nested-comments apps/react-lab/src/experiments/architecture/
git mv apps/react-lab/src/money-lion-offer-explorer apps/react-lab/src/experiments/architecture/offer-explorer
git mv apps/react-lab/src/undoable-counter apps/react-lab/src/experiments/state-and-data-flow/
git mv apps/react-lab/src/bank-system apps/react-lab/src/experiments/state-and-data-flow/
git mv apps/react-lab/src/money-lion-account-activity apps/react-lab/src/experiments/state-and-data-flow/account-activity
git mv apps/react-lab/src/search apps/react-lab/src/experiments/async-workflows/
git mv apps/react-lab/src/shipment-exception-queue apps/react-lab/src/experiments/async-workflows/
git mv apps/react-lab/src/crypto-converter apps/react-lab/src/experiments/async-workflows/
git mv apps/react-lab/src/memory-game apps/react-lab/src/experiments/ux-and-quality/
git mv apps/react-lab/src/wordle apps/react-lab/src/experiments/ux-and-quality/
```

- [ ] **Step 2: Update only cross-module imports**

Update imports in `apps/react-lab/src/lab/experiment.routes.tsx` to the new category paths. Keep imports inside an experiment relative to its own moved directory.

Example:

```ts
import NestedCommentsDemo from '../experiments/architecture/nested-comments/NestedCommentsDemo';
import SearchDemo from '../experiments/async-workflows/search/SearchDemo';
```

- [ ] **Step 3: Verify moves did not change behavior**

Run:

```bash
npm test --workspace react-lab
npm run build --workspace react-lab
```

Expected: the same tests that passed before the move still pass.

- [ ] **Step 4: Commit**

```bash
git add apps/react-lab/src
git commit -m "refactor: group experiments by engineering concept"
```

### Task 8: Document the Active Experiment Standard

**Files:**
- Create: `docs/experiment-standard.md`
- Create: `docs/architecture/react-lab.md`
- Create: five `README.md` files beside priority experiment implementations

- [ ] **Step 1: Write the shared standard**

Create `docs/experiment-standard.md` with these required headings:

```markdown
# Experiment Standard

## Purpose
State one focused engineering question.

## Required evidence
Every maintained experiment documents Problem, Decisions, Verification, and Production considerations.

## Quality baseline
- Builds from the root workspace.
- Has deterministic automated tests or explicit acceptance criteria.
- Supports keyboard use and meaningful landmarks where interactive.
- Handles loading, empty, error, and success states when remote data is involved.
- Avoids abstractions without at least two real callers.

## Status
- `stable`: intended behavior is tested and documented.
- `exploring`: useful implementation with a clearly stated limitation.
```

- [ ] **Step 2: Document the React Lab seam**

Create `docs/architecture/react-lab.md` explaining:

- the registry is the discovery interface;
- `experiment.routes.tsx` is the adapter from registry routes to React implementations;
- `catalog.ts` owns pure filtering behavior;
- experiment modules own their domain behavior and styles;
- parity tests prevent metadata and navigation drift.

Include this dependency direction:

```text
LabHome -> registry + catalog
routes  -> registry contract + route adapters
route adapter -> experiment implementation
experiment implementation -X-> catalog internals
```

- [ ] **Step 3: Add notes for each priority experiment**

Create a focused `README.md` inside:

```text
apps/react-lab/src/experiments/architecture/nested-comments/
apps/react-lab/src/experiments/architecture/offer-explorer/
apps/react-lab/src/experiments/async-workflows/search/
apps/react-lab/src/experiments/async-workflows/shipment-exception-queue/
apps/react-lab/src/experiments/state-and-data-flow/account-activity/
```

Each file must use this exact structure:

```markdown
# Nested Comments

## Problem
Represent an arbitrarily deep discussion tree while keeping reply, edit, delete, collapse, and undo behavior predictable.

## Decisions
- Keep tree transformations in pure functions so recursive updates remain testable outside React.
- Give each rendered comment ownership of its local interaction state while the tree module owns structural changes.

## Verification
`comment-tree.test.ts` verifies structural operations and `NestedComments.test.tsx` verifies user-visible interaction behavior.

## Production considerations
Persist mutations through an authenticated API, add optimistic-conflict recovery, virtualize very large discussions, and announce structural updates to assistive technology.
```

Use the same four headings for the other priority experiments, but replace the body with statements verified against that experiment's implementation and test files. Do not claim absent behavior.

Do not claim behavior that is absent from the implementation.

- [ ] **Step 4: Review documentation against code**

Run:

```bash
grep -RInE 'TBD|TODO|FIXME|PLACEHOLDER' docs apps/react-lab/src/experiments --include='*.md'
npm run format:check
```

Expected: grep returns no matches and formatting passes.

- [ ] **Step 5: Commit**

```bash
git add docs apps/react-lab/src/experiments
git commit -m "docs: define experiment quality standard"
```

### Task 9: Move Historical Material into the Archive

**Files:**
- Create: `archive/README.md`
- Move: directories listed in the Archive Mapping section

- [ ] **Step 1: Create archive category directories**

Run:

```bash
mkdir -p archive/{legacy-angular,tutorials,interview-exercises,algorithms,miscellaneous}
```

- [ ] **Step 2: Move legacy Angular projects**

Run:

```bash
for path in Angular-Material AngularCRUD ComponentHooks lifecycle-hooks mock-app ng-demo ngrx-store-counter ngrx-store-demo; do
  git mv "$path" archive/legacy-angular/
done
```

- [ ] **Step 3: Move tutorials**

Run:

```bash
for path in Calculator-HTML changeOrder delegation demo deno-jumpstart domContentLoaded Event_preventDefault Event_Propagation infinite-page-scrolling Learn-GraphQL NodeJS sundey vanilaJSProjects webFullStack; do
  git mv "$path" archive/tutorials/
done
```

- [ ] **Step 4: Move interview material**

Run:

```bash
for path in GoldMan-Sachs interview-prapare-2022 Lab Mock Practice T-mobile; do
  git mv "$path" archive/interview-exercises/
done
```

- [ ] **Step 5: Move algorithms and miscellaneous projects**

Run:

```bash
git mv leetcode archive/algorithms/
git mv leetcode-ts archive/algorithms/
for path in Node-URL-Shortener-Service-main rest-service Shoppingview; do
  git mv "$path" archive/miscellaneous/
done
```

- [ ] **Step 6: Write the archive policy**

Create `archive/README.md`:

```markdown
# Archive

This directory preserves earlier learning projects, interview exercises, tutorials, and superseded framework examples.

Archived projects are historical references. They are not part of the maintained npm workspace, are not included in CI, and may depend on outdated runtimes or packages.

Current, reviewed experiments live in [`apps/`](../apps/). The active experiment quality standard is documented in [`docs/experiment-standard.md`](../docs/experiment-standard.md).
```

- [ ] **Step 7: Verify maintained commands ignore the archive**

Run:

```bash
npm run build
npm test
git status --short
```

Expected: workspace commands pass without installing or executing any project below `archive/`. Git reports renames rather than delete/add pairs where content is unchanged.

- [ ] **Step 8: Commit**

```bash
git add archive
git commit -m "refactor: separate historical projects from active labs"
```

### Task 10: Publish the Recruiter-Facing Root README

**Files:**
- Create: `README.md`
- Delete: `README-REPO-LAYOUT.md`
- Modify: `apps/react-lab/README.md`
- Modify: `apps/angular-lab/README.md`

- [ ] **Step 1: Create the root README**

Create `README.md` with this section order:

```markdown
# Engineering Lab

A structured engineering lab for exploring frontend architecture, React patterns, and practical full-stack systems.

## Featured experiments

- [Nested Comments](apps/react-lab/src/experiments/architecture/nested-comments) — recursive UI and immutable tree updates.
- [Offer Explorer](apps/react-lab/src/experiments/architecture/offer-explorer) — query, repository, and presentation seams.
- [Shipment Exception Queue](apps/react-lab/src/experiments/async-workflows/shipment-exception-queue) — operational filtering and resolution workflows.
- [Resilient Search](apps/react-lab/src/experiments/async-workflows/search) — debouncing, cancellation, and stale-response handling.
- [Account Activity](apps/react-lab/src/experiments/state-and-data-flow/account-activity) — explicit transitions and derived account state.

## What I explore

- Frontend architecture and state boundaries
- Async workflows and resilient data fetching
- Accessible, performance-conscious interaction design
- Practical full-stack integration patterns
- Testing strategies that verify behavior at stable interfaces

## Repository map

- `apps/react-lab` is the primary searchable React experiment catalog.
- `apps/angular-lab` contains current Angular experiments.
- `docs` records architecture and the experiment quality standard.
- `archive` preserves historical learning material outside the maintained workspace.

## Run locally

    npm install
    npm run dev:react
    npm run dev:angular
    npm test
    npm run build

## Experiment standard

Maintained experiments identify the problem, key decisions, verification strategy, and production considerations. See [the full standard](docs/experiment-standard.md).

## Archive

Earlier tutorials, interview exercises, algorithms, and superseded framework projects remain available under [archive](archive/README.md) as historical references.
```

- [ ] **Step 2: Update application READMEs**

Update `apps/react-lab/README.md` to describe:

- catalog purpose;
- category model;
- local React commands from the repository root;
- registry and experiment paths;
- testing commands.

Update `apps/angular-lab/README.md` to describe it as the secondary modern Angular lab and remove generic Angular CLI boilerplate not specific to this repository.

- [ ] **Step 3: Remove superseded layout instructions**

Run:

```bash
git rm README-REPO-LAYOUT.md
```

- [ ] **Step 4: Verify every README link**

Run:

```bash
npm run format:check
git diff --check
```

Manually open every relative link in the root README and confirm its target exists.

- [ ] **Step 5: Commit**

```bash
git add README.md apps/react-lab/README.md apps/angular-lab/README.md README-REPO-LAYOUT.md
git commit -m "docs: present Demos as an engineering lab"
```

### Task 11: Add Maintained-Surface CI

**Files:**
- Create: `.github/workflows/quality.yml`

- [ ] **Step 1: Create the workflow**

Create `.github/workflows/quality.yml`:

```yaml
name: Quality

on:
  pull_request:
  push:
    branches:
      - master

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install maintained workspaces
        run: npm ci

      - name: Check formatting
        run: npm run format:check

      - name: Test maintained workspaces
        run: npm test

      - name: Build maintained workspaces
        run: npm run build
```

- [ ] **Step 2: Run the same verification locally**

Run:

```bash
npm ci
npm run format:check
npm test
npm run build
git diff --check
```

Expected: every command exits `0`.

- [ ] **Step 3: Confirm archive exclusion**

Run:

```bash
npm query .workspace | grep -E 'archive|legacy|tutorial' && exit 1 || true
```

Expected: no archived path is reported as a workspace.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/quality.yml package-lock.json
git commit -m "ci: verify maintained engineering labs"
```

### Task 12: Final Repository Verification

**Files:**
- Verify: all changed files

- [ ] **Step 1: Confirm only intended files are tracked**

Run:

```bash
git status --short
git diff master...HEAD --stat
git diff master...HEAD --name-status
```

Expected: no `.orig`, local `.vscode`, generated `dist`, or unrelated user file is included.

- [ ] **Step 2: Run clean-install verification**

Run:

```bash
npm ci
npm run format:check
npm test
npm run build
```

Expected: all commands exit `0`.

- [ ] **Step 3: Inspect the React Lab**

Run:

```bash
npm run dev:react
```

Verify at `http://localhost:5173`:

- the purpose is clear above the fold;
- featured experiments appear before the full catalog;
- search matches title, summary, technology, and concept text;
- category filters combine correctly with search;
- empty results can be reset;
- all experiment links load;
- unknown routes return to the catalog;
- keyboard focus is visible;
- layout remains readable at 375px and 1440px widths;
- reduced-motion preferences are respected.

- [ ] **Step 4: Inspect the Angular Lab**

Run:

```bash
npm run dev:angular
```

Expected: the maintained Angular application starts from the root workspace command.

- [ ] **Step 5: Review commit history**

Run:

```bash
git log --oneline --decorate master..HEAD
```

Expected: commits are small enough to distinguish workspace setup, registry, catalog, shell, experiment moves, documentation, archive, README, and CI.

- [ ] **Step 6: Prepare publication**

Run:

```bash
git status --short
git push -u origin codex/engineering-lab-refactor
gh pr create \
  --base master \
  --head codex/engineering-lab-refactor \
  --title "Refactor Demos into a structured engineering lab" \
  --body-file docs/superpowers/specs/2026-07-29-engineering-lab-refactor-design.md
```

Expected: branch push succeeds and GitHub returns a pull-request URL. Do not merge until CI passes and the rendered README and React Lab have been reviewed.
