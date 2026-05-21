## 2025-05-21 - [Optimized Home rendering logic from O(N²) to O(N)]
**Learning:** Nested filtering and deduplication within React render loops create significant bottlenecks as the dataset grows. In this app, for every category, the entire food item list was being filtered and then deduplicated using O(M²) logic, leading to noticeable lag during search.
**Action:** Use `useMemo` to pre-group and deduplicate data into a `Map` in a single O(N) pass outside the render loop. This ensures that the actual rendering only performs O(1) lookups per category.
