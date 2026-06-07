## 2026-06-07 - [O(N*M) Rendering Bottleneck in Home.js]
**Learning:** Performing nested filtering and deduplication (O(N*M)) inside the render loop for categories significantly degrades UI responsiveness, especially during search.
**Action:** Use `useMemo` to pre-group and deduplicate data into a Map (O(N)) outside the render loop, allowing for O(1) lookup during rendering.
