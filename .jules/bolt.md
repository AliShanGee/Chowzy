## 2025-05-18 - Deduplicating categories and items in Home.js
**Learning:** Replaced O(N^2) category deduplication (`filter` + `findIndex`) and O(K^2) item deduplication (`filter` + `reduce` with array spreading) in `src/screens/Home.js` with `useMemo` and single-pass `Set` checks, eliminating redundant render recalculations and array allocations.
**Action:** When filtering or deduplicating lists in React components, avoid nested `findIndex` or `reduce` with array spreads (`[...acc, item]`); use `Set` for O(1) existence checks and memoize calculations that depend on API state.
