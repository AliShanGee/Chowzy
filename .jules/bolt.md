## 2025-05-15 - Optimizing Render-Loop Data Processing

**Learning:** React components that process large datasets (filtering, grouping, deduplicating) inside the render loop can hit O(N^2) or worse complexity if nested within maps. In this project, Home.js was filtering the entire food items list for every category, leading to significant lag as the menu grows.

**Action:** Move expensive data processing (filtering, grouping) out of the JSX mapping and into a `useMemo` hook that runs once per data update. Use efficient data structures like `Map` for O(1) grouping and `Set` for O(1) deduplication.
