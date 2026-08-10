## 2025-03-01 - Memoization and Grouping Optimization in Home.js
**Learning:** Sequential/nested filter and reduce loops in React rendering can hit O(C * N^2) complexity where C is category count and N is item count. Pre-processing the items using `useMemo` into category maps in a single O(N) pass, and optimizing category deduplication via `Set` in O(C) prevents UI lag during fast typing or list filtering.
**Action:** Lift nested category filtering and de-duplication into dedicated `useMemo` hooks with a category Map to keep complexity linear and renders lightning-fast.
