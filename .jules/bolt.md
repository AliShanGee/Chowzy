## 2025-05-14 - Map-based Grouping in Render Loop
**Learning:** Performing nested O(N*M) filtering and O(N^2) deduplication inside a React render loop (especially inside a map) causes significant UI lag as data grows. Replacing this with O(N) Map-based grouping in a useMemo hook dramatically improves performance.
**Action:** Always move data processing, deduplication, and grouping out of the render loop and into memoized hooks using efficient data structures like Map or Set for lookups.
