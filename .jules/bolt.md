## 2025-03-05 - Search Optimisation in Home screen
**Learning:** Nested category filtering and deduplication within React render loops creates an $O(C \times N^2)$ complexity bottleneck on search input change (where $C$ is category count and $N$ is food item count), causing significant main-thread blockages and UI lagging when dataset scales.
**Action:** Lift unique category extraction into its own $O(C)$ complexity `useMemo` using a `Set`, and build a category-to-items Map in a single $O(N)$ pass `useMemo` for search-filtered and deduplicated food items.
