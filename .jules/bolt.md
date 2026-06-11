## 2025-05-14 - [React Home Screen O(N) Optimization]
**Learning:** Performing O(N*C) filtering and O(C^2) deduplication inside an IIFE within JSX causes significant performance degradation as the item count grows, even with small category counts, especially since it runs on every render (e.g. theme toggle).
**Action:** Use `useMemo` to pre-calculate unique categories and a Map-based grouping strategy to achieve O(N) complexity for item filtering and deduplication, while ensuring dependency arrays include pagination and search state.
