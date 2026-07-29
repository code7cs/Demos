# Engineering Lab Repository Refactor

## Purpose

Refactor `code7cs/Demos` from a mixed collection of exercises, tutorials, interview artifacts, and modern demos into a structured engineering lab.

The repository will primarily demonstrate React and frontend architecture, with selected full-stack and modern Angular experiments as supporting evidence. It will not present small demos as large production systems. Instead, it will make the engineering question, design decisions, verification strategy, and production considerations behind each experiment easy to understand.

The intended audience is recruiters and engineers evaluating Hanfan Wang for senior full-stack roles with a frontend emphasis.

## Positioning

The repository README will lead with:

> A structured engineering lab for exploring frontend architecture, React patterns, and practical full-stack systems.

The active portion of the repository will communicate:

- depth of frontend experience;
- systematic architectural thinking;
- pragmatic full-stack capability;
- attention to testing, accessibility, performance, and maintainability;
- the ability to distinguish an experiment from production-ready software.

Historical material will remain available under `archive/`, but it will not compete with maintained work for attention.

## Repository Architecture

```text
Demos/
├── apps/
│   ├── react-lab/
│   │   └── src/
│   │       ├── lab/
│   │       └── experiments/
│   │           ├── architecture/
│   │           ├── state-and-data-flow/
│   │           ├── async-workflows/
│   │           ├── ux-and-quality/
│   │           └── full-stack/
│   └── angular-lab/
├── docs/
│   ├── architecture/
│   ├── experiment-standard.md
│   └── superpowers/specs/
├── archive/
│   ├── legacy-angular/
│   ├── tutorials/
│   ├── interview-exercises/
│   ├── algorithms/
│   └── miscellaneous/
├── .github/workflows/
├── package.json
└── README.md
```

### Active applications

`apps/react-lab` is the primary application and the main recruiter-facing experience. The existing `react-demos` application will move here while preserving Git history.

`apps/angular-lab` contains the current Angular 21 application. It is a secondary demonstration of framework breadth, not an equal-weighted alternative to the React lab.

### Experiment implementation

Experiment code remains inside its owning application. React experiments live under `apps/react-lab/src/experiments/<category>/`; they are not split into many independent packages or applications.

The `lab/` module owns navigation, discovery, filtering, shared experiment presentation, and the experiment registry. Its interface is the typed registry plus the shared experiment shell. Individual experiments do not need to understand discovery or global navigation.

No shared `packages/` directory will be introduced in the first phase. A shared module will be extracted only when at least two real callers require the same behavior.

### Archive

The archive preserves history but is outside the maintained workspace and CI surface. It will contain:

- superseded Angular applications and framework tutorials;
- isolated HTML, CSS, JavaScript, and Node learning exercises;
- interview assessments and practice material;
- algorithm collections;
- miscellaneous historical experiments that do not meet the active experiment standard.

Moving a project to the archive does not claim that it is production-ready or actively maintained. Binary assessment files, generated artifacts, editor metadata, and accidental temporary files should be excluded from the curated surface and reviewed separately before any deletion.

## Experiment Interface

Every discoverable React experiment is registered through a typed interface:

```ts
type ExperimentCategory =
  | 'architecture'
  | 'state-and-data-flow'
  | 'async-workflows'
  | 'ux-and-quality'
  | 'full-stack';

type ExperimentStatus = 'stable' | 'exploring';

type ExperimentDefinition = {
  slug: string;
  title: string;
  summary: string;
  category: ExperimentCategory;
  technologies: string[];
  concepts: string[];
  status: ExperimentStatus;
  route: string;
};
```

The registry is the single source of truth for the React Lab catalog and navigation. Search, category filtering, featured cards, and routes consume it rather than maintaining separate lists.

Registry validation must guarantee:

- unique slugs and routes;
- supported category and status values;
- a valid route for every registered experiment;
- no navigation entry without a corresponding experiment.

## Experiment Standard

An active experiment must provide:

1. **Problem** — the engineering behavior or constraint being explored.
2. **Implementation** — a directly runnable example with a focused interface.
3. **Decisions** — the important trade-offs and why the implementation chose them.
4. **Verification** — automated tests or explicit observable acceptance criteria.
5. **Production considerations** — what would change for scale, reliability, security, accessibility, or maintainability.

The standard applies proportionally. A small state-management experiment can have concise notes; it does not need artificial layers or enterprise terminology.

Experiments share:

- a consistent page shell and return navigation;
- responsive layout and accessible landmarks;
- common status and technology labels;
- predictable locations for tests and supporting notes.

Initial priority experiments are:

- nested comments;
- shipment exception queue;
- search;
- offer explorer;
- account activity.

Smaller examples such as the memory game, undoable counter, crypto converter, Wordle, and bank system remain available but receive lower visual priority until they meet the experiment standard.

## React Lab Experience

The React Lab home page will include:

1. a concise engineering-lab introduction;
2. a small set of featured experiments;
3. category filters;
4. text search across titles, summaries, technologies, and concepts;
5. experiment cards that lead with the problem being explored;
6. a brief explanation of the experiment quality standard.

The design should be polished and restrained. It should reuse a coherent visual system rather than giving every experiment an unrelated appearance. Animation is optional and must not interfere with scanning, accessibility, or reduced-motion preferences.

## Root README

The repository README will be recruiter-friendly and concise:

1. repository positioning;
2. featured experiments with links and short problem statements;
3. engineering themes being explored;
4. repository map;
5. setup, run, test, and build commands;
6. experiment quality standard;
7. archive policy.

The README will not apologize for the size of the experiments. It will distinguish current experiments from historical learning material and explain how to evaluate the maintained work.

## Workspace and Commands

The root will use npm workspaces for maintained applications only.

The intended root command interface is:

```text
npm install
npm run dev:react
npm run dev:angular
npm run build
npm test
npm run format:check
```

Root commands hide per-application command differences. Callers and CI use the root interface rather than reaching into application directories.

The archive is not a workspace member and is not installed, built, or tested by default.

## Verification and CI

The first phase will add a GitHub Actions workflow for maintained applications:

- install dependencies from the root lockfile;
- build React Lab;
- test React Lab;
- build Angular Lab;
- test Angular Lab;
- verify formatting.

React Lab tests will include:

- registry validation;
- catalog search and filtering behavior;
- route-to-registry consistency;
- behavior tests for priority experiments.

Existing valid tests will be preserved during moves. A move is not complete until imports, root scripts, builds, and tests work from the new locations.

Archive projects are explicitly excluded from CI.

## Error Handling and Resilience

- Unknown React routes redirect to the catalog without crashing.
- An empty filter result provides a clear reset action.
- Registry validation fails tests with the offending slug or route.
- A single experiment should not require catalog-specific error handling.
- Experiments that simulate asynchronous failures must expose deterministic states suitable for tests.

## Migration Strategy

The refactor will be delivered in small, reviewable commits:

1. establish root workspace configuration and CI expectations;
2. move `react-demos` to `apps/react-lab` with no behavioral redesign;
3. move `angular-demos` to `apps/angular-lab`;
4. introduce the experiment registry and route consistency tests;
5. reorganize React experiments by category;
6. build the React Lab catalog, search, filters, and shared shell;
7. add experiment notes and production considerations to priority experiments;
8. move legacy material into documented archive categories;
9. replace the root README and complete verification.

File moves should use Git-aware moves where practical so history remains traceable. Temporary files and existing unrelated local changes must not be included in commits.

## First-Phase Boundaries

The first phase will:

- create the maintained workspace structure;
- organize and document existing material;
- improve discovery and presentation;
- introduce consistent quality gates;
- preserve existing demo behavior unless a move exposes a defect.

The first phase will not:

- turn every toy demo into a production application;
- rewrite all historical code;
- add speculative shared packages;
- add authentication, databases, or deployment solely to make the repository appear more complex;
- delete historical material without explicit review;
- include the archive in normal CI.

Substantial improvements to individual experiments will be planned as later, independently reviewable iterations.

## Success Criteria

The refactor is successful when:

- a recruiter can understand the repository's purpose and strongest work within two minutes;
- active React experiments are discoverable by engineering concept;
- the maintained and historical surfaces are unmistakably separate;
- all maintained applications install, build, and test from root commands;
- every registered experiment has a valid route and required metadata;
- priority experiments explain their problem, decisions, verification, and production considerations;
- CI verifies the maintained surface without depending on archived projects;
- existing unrelated user files and local changes remain untouched.
