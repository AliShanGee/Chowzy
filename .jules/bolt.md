## 2025-05-22 - O(N) Item Grouping in Home Screen
**Learning:** Replacing nested O(Categories * Items^2) render-time filtering/deduplication with a Map-based O(Items) grouping inside useMemo yields a 7-50x speedup depending on dataset size.
**Action:** Always prefer O(N) grouping over nested filtering for large lists with category grouping.
