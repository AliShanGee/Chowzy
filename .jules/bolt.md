## 2025-05-15 - Optimizing data processing in Home.js
**Learning:** O(N*C) nested filtering and O(C^2) deduplication inside the render loop significantly bottlenecks UI responsiveness as data grows. Map-based grouping and Set-based deduplication in useMemo provides a massive speedup (~91x) for render-loop processing.
**Action:** Always prefer O(N) grouping strategies for large datasets in React components, especially when rendering categorized lists with potential duplicates. Pre-calculate lowercase strings for search to avoid redundant work.
