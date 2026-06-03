## 2025-06-03 - [Home.js Render Optimization]
**Learning:** Performing O(N) filtering and deduplication inside a map over categories in the render loop leads to O(M*N) complexity on every render, which becomes a major bottleneck as the dataset grows or during active search.
**Action:** Use useMemo to pre-process raw data into a Map-based grouping in O(N) time, allowing the render loop to perform O(1) lookups per category. This pattern is essential for lists with nested filtering.
