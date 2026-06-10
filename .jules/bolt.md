## 2025-06-10 - Home.js O(N) Data Processing Optimization
**Learning:** React render loops that perform $O(N^2)$ or $O(N \times M)$ filtering and deduplication on every render are massive bottlenecks as data scales. Using `useMemo` to pre-calculate these values in $O(N)$ using `Set` and `Map`-like grouping significantly improves responsiveness.
**Action:** Always check if list filtering/grouping can be moved into a `useMemo` hook with a single pass over the data.

## 2025-06-10 - Leaf Component Memoization
**Learning:** When a parent component's state changes frequently (e.g., search input), wrapping leaf components like `Card` in `React.memo` is essential to prevent thousands of unnecessary re-renders, even if the parent logic is optimized.
**Action:** Use `React.memo` for list items when the parent list is subject to high-frequency updates.
