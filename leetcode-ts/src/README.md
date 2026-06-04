# `src/` layout — NeetCode 150 order

Folders follow the [NeetCode 150 roadmap](https://neetcode.io/roadmap) (pattern-first, not DFS/BFS as top-level topics — those live under **graphs** / **trees**).

| # | Folder | NeetCode topic | Typical patterns |
|---|--------|----------------|------------------|
| 01 | `01-arrays-hashing` | Arrays & Hashing | hash map, counting, anagrams |
| 02 | `02-two-pointers` | Two Pointers | sorted pairs, 3Sum |
| 03 | `03-sliding-window` | Sliding Window | substring, subarray |
| 04 | `04-stack` | Stack | monotonic stack, min stack |
| 05 | `05-binary-search` | Binary Search | sorted search, rotated array |
| 06 | `06-linked-list` | Linked List | reverse, cycle, merge |
| 07 | `07-trees` | Trees | BFS, DFS, recursion |
| 08 | `08-heap` | Heap / Priority Queue | top K, median |
| 09 | `09-backtracking` | Backtracking | subsets, permutations |
| 10 | `10-tries` | Tries | prefix tree |
| 11 | `11-graphs` | Graphs | BFS, DFS, union-find |
| 12 | `12-advanced-graphs` | Advanced Graphs | Dijkstra, MST |
| 13 | `13-1d-dp` | 1-D Dynamic Programming | linear DP |
| 14 | `14-2d-dp` | 2-D Dynamic Programming | grid DP |
| 15 | `15-greedy` | Greedy | local optimum |
| 16 | `16-intervals` | Intervals | merge, insert |
| 17 | `17-math-geometry` | Math & Geometry | formulas, matrices |
| 18 | `18-bit-manipulation` | Bit Manipulation | masks, XOR |

**Root files:** `types.ts`, `_template.ts` (shared helpers).

**New problem:** copy `_template.ts` → `NN-topic/NNNN-slug.ts`, set `import` from `../types.js`, run `npm run solve src/NN-topic/NNNN-slug.ts`.
