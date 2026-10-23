## 2025-05-18 - Home Screen Item Filtering & Category Deduplication
**Learning:** React render loops that perform $O(C^2)$ `Array.findIndex` deduplication and $O(K^2)$ `.reduce()` array spreading inside category mapping lead to noticeable main thread lag on every keystroke/render when filtering list items.
**Action:** Use `useMemo` with `Set` for $O(N)$ unique category calculation and single-pass `Set` filtering for item deduplication per category.
