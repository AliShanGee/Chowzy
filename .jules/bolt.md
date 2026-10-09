## 2025-05-18 - Home Screen Category and Food Item Filtering Optimization
**Learning:** In React components rendering filtered lists nested within category loops, performing array `.reduce()` with `[...acc, item]` and `.some()` creates an $O(K^2)$ operation with high object allocation overhead per re-render (e.g. typing in search inputs).
**Action:** Move category deduplication to top-level `useMemo`, pre-calculate search term lowercase transformations outside loops, and use single-pass $O(N)$ filtering with a `Set` for deduplication.
