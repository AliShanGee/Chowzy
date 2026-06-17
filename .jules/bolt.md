# Bolt's Journal - Critical Performance Learnings

## 2026-06-17 - O(N*C) Bottleneck in Home.js
**Learning:** The Home.js component performs nested filtering and deduplication in its render loop. For every category (C), it filters the entire food items array (N) and then performs an O(K²) deduplication (where K is the number of items in that category). This results in O(N*C + C*K²) complexity every render, which is especially costly during search updates.

**Action:** Move data processing into `useMemo` and use a Map-based grouping strategy to achieve O(N) complexity for data preparation and O(N) for search filtering, bypassing the nested overhead.

## Benchmark Results
- **Dataset:** 5000 items, 50 categories
- **Average Current Logic (Search Render):** 0.4129ms
- **Average Optimized Logic (Search Render):** 0.0059ms
- **Measured Speedup:** ~69x
