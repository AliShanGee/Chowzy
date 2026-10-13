## 2025-05-18 - Home Screen Category and Item Filtering Optimization
**Learning:** In React components rendering list categories and food items (like `Home.js`), category deduplication using `.filter` with `.findIndex` inside render functions causes O(M^2) redundant scanning on every keystroke, and `.reduce` with `.some` causes O(N^2) array allocations per category.
**Action:** Memoize category deduplication with `useMemo`, normalize search queries once per render outside loops, and perform O(N) item deduplication using a single-pass `Set`.
