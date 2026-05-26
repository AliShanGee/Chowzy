## 2025-05-15 - [Home.js Data Processing Optimization]
**Learning:** Performing nested O(N²) filtering and deduplication (using `filter` + `reduce` + `some`) directly inside the JSX render block causes redundant calculations on every render, including theme toggles or page changes.
**Action:** Use `useMemo` to pre-calculate and group data into a `Map` structure in O(N) time. This ensures that the heavy lifting is only done when the underlying data (`foodCat`, `foodItem`) or search query changes, and makes the render phase O(1) for data lookup.
