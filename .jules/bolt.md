## 2026-04-15 - O(N^2) Render Loop Optimization in Home.js
**Learning:** React components that perform nested filtering and deduplication in the render loop cause noticeable lag during state updates (like search input changes), scaling poorly with data size.
**Action:** Use `useMemo` to pre-process, filter, and group data in O(N) using a Map, reducing render complexity and improving responsiveness.
