## 2026-06-06 - Optimized Home.js Data Processing
**Learning:** O(N^2) filtering and deduplication within a React render loop significantly impact performance when the dataset grows. Memoizing the data grouping and deduplication outside the render loop using Maps and Sets reduces the complexity to O(N) and drastically cuts down re-render time.
**Action:** Always prefer O(N) Map/Set lookups for data grouping and deduplication, and ensure expensive data processing is wrapped in useMemo to prevent redundant execution on every render.
