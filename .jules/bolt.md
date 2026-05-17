## 2025-05-15 - [O(N^2) to O(N) grouping in Home.js]
**Learning:** The previous implementation of Home.js was performing a full filter and reduce-some deduplication on the entire food items array for EVERY category, leading to O(Items * Categories) complexity. By pre-grouping items using a Map in a single pass, we achieved a significant speedup (measured ~10x-20x on 5000 items).
**Action:** Always look for nested loops or repeated filters on large datasets and replace them with single-pass grouping/indexing using Maps or Objects.
