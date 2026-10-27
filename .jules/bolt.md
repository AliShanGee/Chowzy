## 2026-10-27 - Memoize Category Filtering and Deduplication in React List Views

**Learning:** In React list views where items are grouped into categories and filtered by search queries, performing inline `items.filter().reduce((acc, item) => acc.some(...) ? acc : [...acc, item], [])` inside JSX loops creates an O(C * M * K) time complexity and quadratic temporary array spreading (`[...acc, item]`) on every render frame.
**Action:** Use `useMemo` to construct a single-pass `Map<CategoryName, { items, seenNames }>` in O(M) time with O(1) `Set` deduplication, allowing O(1) lookups in JSX category mapping and eliminating unnecessary heap allocations on search input state changes.
