# Engineering Lab

A structured engineering lab for exploring frontend architecture, React patterns, and practical full-stack systems.

## Featured experiments

- [Nested Comments](apps/react-lab/src/experiments/architecture/nested-comments) — recursive UI and immutable tree updates.
- [Offer Explorer](apps/react-lab/src/experiments/architecture/offer-explorer) — query, repository, and presentation seams.
- [Shipment Exception Queue](apps/react-lab/src/experiments/async-workflows/shipment-exception-queue) — operational filtering and resolution workflows.
- [Resilient Search](apps/react-lab/src/experiments/async-workflows/search) — debouncing, cancellation, and stale-response handling.
- [Account Activity](apps/react-lab/src/experiments/state-and-data-flow/account-activity) — explicit transitions and derived state.

## What I explore

- Frontend architecture and state boundaries
- Async workflows and resilient data fetching
- Accessible, performance-conscious interaction design
- Practical full-stack integration patterns
- Testing behavior through stable interfaces

## Repository map

- `apps/react-lab` — primary React and TypeScript experiment catalog
- `apps/angular-lab` — modern Angular experiments
- `docs` — architecture decisions and implementation plans
- [`archive`](archive) — historical tutorials, interview exercises, algorithms, and superseded projects

## Run locally

```bash
npm install
npm run dev:react
npm run dev:angular
npm test
npm run build
```

Each active experiment is registered with a problem statement, engineering concepts, technologies, maturity status, and a stable route. The React Lab home page supports search and category filtering without pretending small experiments are production products.