## 2026-05-01 - Optimized Home screen render loop and memoized food cards
**Learning:** The Home screen used O(Categories * Items^2) nested filtering and deduplication in its render loop, which caused noticeable lag as the dataset grew. Standardizing data into an O(N) Map for grouping and deduplicating items by category significantly improved render performance.
**Action:** Always check for nested array operations in React render loops, especially those performing deduplication via `some` or `findIndex`, and replace them with pre-computed Maps via `useMemo`.
