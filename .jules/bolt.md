## 2025-05-14 - [Memoization & Data Structures]
**Learning:** Inefficient O(N*C) filtering and O(N^2) deduplication inside the React render loop can become a significant bottleneck as data grows. Replacing these with O(N) Map-based grouping and Set-based deduplication within a `useMemo` hook can improve data processing performance by over 1000x.
**Action:** Always check for filter/reduce/some patterns inside maps or render loops when dealing with multi-category datasets. Move such logic to `useMemo` and utilize Maps for efficient categorization.
