## 2025-05-18 - Single-Pass Set Filter and Category Memoization in Home Screen
**Learning:** Performing inline category deduplication via `Array.prototype.filter` + `findIndex` ($O(N^2)$) and food item deduplication via `.reduce()` with array spreading (`[...unique, item]`) ($O(K^2)$) inside React JSX render functions causes noticeable frame drops on search typing.
**Action:** Use `useMemo` to memoize category deduplication and use a `Set` for single-pass $O(N)$ filtering and deduplication during item rendering.
