# Bolt's Journal

## 2026-10-31 - Memoizing Nested Category Slicing and Single-Pass Item Map Lookups
**Learning:** In screens rendering categorized lists with search and pagination (like `Home.js`), running deduplication `.filter()` with `.findIndex()` inline on every render causes $O(C^2)$ re-evaluation, while nested inline filtering with `.reduce()` and array spreading `[...unique, item]` creates $O(C \times M \times K)$ quadratic allocations on every keystroke or theme change.
**Action:** Lift deduplication into `useMemo`, replace $O(C^2)$ findIndex loops with a Set, and pre-index items for visible categories in a single $O(M)$ pass into a Map with Set-based name deduplication.
