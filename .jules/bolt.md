## 2025-05-14 - O(N) Item Grouping and Memoization in Home.js
**Learning:** The original Home.js logic performed nested O(N*M) filtering and deduplication during every render, which became a significant bottleneck as the number of items increased. Moving data processing into useMemo and using a Map-based O(N) grouping approach significantly improves performance.
**Action:** Always prefer O(N) data transformations over nested loops/filters in render blocks, especially for lists that re-render frequently (e.g., during search).
