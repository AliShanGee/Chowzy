## 2025-05-22 - O(N) Grouping for Nested Lists
**Learning:** Nested rendering loops that filter and deduplicate large lists (e.g., categories containing items) lead to O(Categories * Items^2) complexity. This causes visible lag during search-driven re-renders.
**Action:** Always pre-calculate groupings and deduplications using `useMemo` and a `Map` to achieve O(Items) complexity before entering the render loop.
