## 2025-05-22 - Multi-stage Memoization in Home Screen
**Learning:** For interactive search over large lists, Stage 1 (grouping/deduplication) should depend only on data, while Stage 2 (filtering) should depend on the search string. This minimizes the work done during user input.
**Action:** Use multi-stage memoization to isolate heavy data transformations from high-frequency state updates like search.
