## 2025-05-14 - O(N) Map-based grouping for render loops
**Learning:** Moving nested filtering and deduplication out of the render loop into a Map-based grouping inside `useMemo` reduces complexity from O(Categories * Items^2) to O(Items), providing massive speedups (over 200x) for large datasets.
**Action:** Always prefer pre-processing and grouping data in `useMemo` when rendering lists with categories or repetitive filtering.
