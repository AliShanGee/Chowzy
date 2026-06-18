## 2025-05-14 - Optimized Home.js Render Logic
**Learning:** Nested `filter` and `reduce` operations inside a `map` loop in React render functions can lead to $O(C \times N^2)$ complexity, where $C$ is the number of categories and $N$ is the number of items. This causes noticeable lag during state updates like searching.
**Action:** Use `useMemo` to group data into a `Map` or object in a single $O(N)$ pass outside the render loop. Deduplicate items using a `Set` for $O(1)$ lookups.
