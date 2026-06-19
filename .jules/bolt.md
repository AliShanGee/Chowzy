## 2025-05-14 - Home.js O(N) Data Transformation
**Learning:** The Home.js screen was performing (N^2)$ operations within the render loop for category grouping and item deduplication, causing significant performance lag on larger datasets.
**Action:** Use `useMemo` to pre-calculate unique categories and group items into a `Map` by category name, reducing the complexity to (N)$ and providing near-instant lookups during rendering.
