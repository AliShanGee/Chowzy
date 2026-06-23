## 2025-01-24 - [Optimization of Home.js render loop]
**Learning:** Performing deduplication and grouping logic (O(N^2) using `filter`, `findIndex`, `some`) directly inside a React render loop (especially via an IIFE) can cause significant UI lag as data grows. In this app, for 50k items, it took ~5ms per render.

**Action:** Use `useMemo` to pull expensive data transformations out of the render path. Use `Set` and `Map` for O(N) deduplication and grouping. When deduplicating, ensure the scope (global vs. per-category) matches the original business logic; use composite keys if necessary.
