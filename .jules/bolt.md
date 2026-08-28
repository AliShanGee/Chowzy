## 2025-05-18 - Memoized Category Filtering and Item Deduplication in Home Screen
**Learning:** Performing nested array operations like `.filter()` and `.reduce()` directly inside JSX render loops creates O(N^2) bottlenecks when rendering lists.
**Action:** Extract list deduplication and category grouping into separate `useMemo` hooks using O(N) Set lookup maps for visible categories.
