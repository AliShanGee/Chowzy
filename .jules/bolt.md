## 2025-05-14 - [Optimization of Home.js Render Loop]
**Learning:** The previous implementation used a nested O(N*C) filtering approach with an O(N^2) deduplication inside the render loop, which led to significant lag with larger datasets (~11ms for 50k items). By pre-grouping items into a Map and deduplicating them using a composite key in a `useMemo` hook, the complexity was reduced to O(N).
**Action:** Always check for nested loops or repeated array scans in the render path, especially when they involve deduplication. Prefer Map/Set for O(1) lookups and useMemo for pre-processing.
