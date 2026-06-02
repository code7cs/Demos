/**
 * LeetCode 49. Group Anagrams
 * https://leetcode.com/problems/group-anagrams/
 *
 * Sprint: LeetCode Sprint 2 — NeetCode 150 (Jun 1–14), Day 1
 *
 * npm run solve src/0049-group-anagrams.ts
 */

function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const s of strs) {
    const key = encode(s);

    if (map.get(key)) {
      map.set(key, [...map.get(key)!, s]);
    } else {
      map.set(key, [s]);
    }
  }

  return [...map.values()];
}

function encode(str: string): string {
  const count = new Array(26).fill(0);

  for (const c of str) {
    const delta = c.charCodeAt(0) - "a".charCodeAt(0);
    count[delta]++;
  }

  return count.join("#");
}

// --- local sanity checks ---
const waInput = ["bdddddddddd", "bbbbbbbbbbc"];
const waOutput = groupAnagrams(waInput);
console.log("WA repro — groups:", waOutput.length, "(expected 2)");
console.log("Keys distinct:", encode("bdddddddddd") !== encode("bbbbbbbbbbc"));

const classic = groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
console.log("Classic — group count:", classic.length, "(expected 3)");
