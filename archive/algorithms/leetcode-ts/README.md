# leetcode-ts

One TypeScript file per LeetCode problem under `src/`, grouped by **NeetCode 150** topic folders.

## Setup

WSL path: `~/_code/Demos/leetcode-ts` (Windows: `\\wsl.localhost\Ubuntu\home\hwang\_code\Demos\leetcode-ts`)

```bash
cd ~/_code/Demos/leetcode-ts
```

**Node.js in WSL:** Use Linux Node (not Windows `npm` on a `\\wsl$` path). If `node` is missing:

```bash
echo 'export PATH="$HOME/.local/node/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
npm install   # or: ./setup.sh
```

## Folder structure

Problems live in numbered topic folders (see [src/README.md](src/README.md) for the full NeetCode 150 map):

```
src/
  types.ts
  _template.ts
  01-arrays-hashing/
  02-two-pointers/
  ...
  18-bit-manipulation/
```

## Add a new problem

1. Pick the NeetCode topic folder (e.g. `04-stack/`).
2. Copy `src/_template.ts` → `src/04-stack/0155-min-stack.ts`.
3. Change the import to `import { runTests } from "../types.js";`
4. Implement and run:

```bash
npm run solve src/04-stack/0155-min-stack.ts
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run solve src/<topic>/<file>.ts` | Run one solution file |
| `npm run typecheck` | Type-check all files in `src/` |

## Naming

Use `NNNN-slug.ts` (e.g. `0001-two-sum.ts`) so files sort by LeetCode number within each folder.

Shared types (`ListNode`, `TreeNode`, `runTests`) live in `src/types.ts`.

**Roadmap:** [NeetCode 150](https://neetcode.io/practice/practice/neetcode150) · [Visual roadmap](https://neetcode.io/roadmap)
