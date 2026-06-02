# leetcode-ts

One TypeScript file per LeetCode problem under `src/`.

## Setup

WSL path: `~/_code/Demos/leetcode-ts` (Windows: `\\wsl.localhost\Ubuntu\home\hwang\_code\Demos\leetcode-ts`)

```bash
cd ~/_code/Demos/leetcode-ts
```

**Node.js in WSL:** Use Linux Node (not Windows `npm` on a `\\wsl$` path). If `node` is missing:

```bash
# Already installed for this machine at ~/.local/node — add to ~/.bashrc:
echo 'export PATH="$HOME/.local/node/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

npm install   # or: ./setup.sh
```

## Add a new problem

1. Copy `src/_template.ts` → `src/0123-problem-slug.ts`
2. Implement your solution and tests at the bottom of the file.
3. Run it:

```bash
npm run solve src/0123-problem-slug.ts
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run solve src/foo.ts` | Run one solution file |
| `npm run typecheck` | Type-check all files in `src/` |

## Naming

Use `NNNN-slug.ts` (e.g. `0001-two-sum.ts`) so files sort by problem number.

Shared types (`ListNode`, `TreeNode`, `runTests`) live in `src/types.ts`.
