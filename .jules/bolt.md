## 2025-05-14 - Optimized Home.js Render Loop
**Learning:** The previous implementation of Home.js had an O(C * N^2) complexity in the render loop due to nested filtering and deduplication of food items within category mapping. This becomes a significant bottleneck as the number of food items (N) and categories (C) grow.
**Action:** Use `useMemo` to pre-process and group items using a `Map` in O(N) time. This ensures that the render loop only iterates over pre-filtered and grouped data, leading to a massive speedup in UI responsiveness during searching and paging.
