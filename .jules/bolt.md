## 2025-05-14 - O(C * N^2) Render Loop Bottleneck in Home.js
**Learning:** The `Home.js` component was performing food item filtering and O(N^2) deduplication (using `reduce` + `some`) inside a category mapping loop. For large datasets, this results in O(C * N^2) complexity, significantly degrading render performance.
**Action:** Lift redundant data processing out of the render loop and memoize it using `useMemo`. Pre-process items into a category-mapped object in a single O(N) pass to reduce rendering complexity to O(N + C).
