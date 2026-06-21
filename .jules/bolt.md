## 2026-05-28 - [O(N) Grouping for Nested Render Loops]
**Learning:** Nested O(N) operations (filtering/deduplication) inside a .map() render loop create O(N^2) bottlenecks that degrade UI responsiveness, especially during high-frequency events like typing in a search bar.
**Action:** Use useMemo to pre-process raw data into O(1) lookup structures (Maps/Sets) outside the render loop. This ensures expensive data transformations only run when the source data changes, not on every re-render.
