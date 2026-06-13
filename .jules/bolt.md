## 2024-05-20 - Home Screen Data Processing Optimization
**Learning:** The previous implementation used nested O(C * N^2) operations (filtering and deduplication with spread in reduce) inside the render loop, causing significant lag on large datasets.
**Action:** Replace nested loops with O(N) grouping using a Map-like object and Set for O(1) deduplication, and wrap the entire calculation in useMemo.

## 2024-05-20 - Redundant Grid Re-renders
**Learning:** Updating a search query in the parent component triggered full re-renders of all Card components in the grid, even if their props hadn't changed.
**Action:** Wrap the Card component in React.memo to bail out of unnecessary re-renders during high-frequency state updates like typing.
