
## 2025-05-18 - Single-Pass Set Duplicate Filtering in Component Render Loops
**Learning:** In React list components like `Home.js`, nested array operations such as `.reduce()` with inner `.some()` lookups produce $O(K^2)$ quadratic allocations per category render. Additionally, calling `.toLowerCase()` repeatedly inside filter loops adds unnecessary string overhead.
**Action:** Pre-calculate lowercased search queries outside loops and use a `Set` for single-pass $O(N)$ filtering and deduplication during list rendering.
