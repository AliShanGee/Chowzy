## 2025-05-15 - O(N^2) to O(N) List Rendering Optimization
**Learning:** The previous implementation of the food list in `Home.js` performed unique category filtering and item deduplication/grouping inside the render loop using `filter`, `findIndex`, `some`, and `reduce`. For a dataset of N items and K categories, this resulted in O(N*K) or even O(N^2) complexity, causing noticeable lag during search input as the entire list re-evaluated.
**Action:** Use `useMemo` to pre-calculate unique categories and group items into a `Map` (O(N)). This decouples heavy data transformation from frequent UI updates like search filtering, which now only operates on pre-grouped, smaller subsets.

## 2025-05-15 - Memoization for High-Frequency Parent Updates
**Learning:** List items (like `Card.js`) that contain complex animations or many sub-components (framer-motion tilt effects, etc.) can become a bottleneck when the parent component re-renders frequently (e.g., on search input).
**Action:** Wrap such leaf components in `React.memo` to prevent redundant re-renders when parent state changes but the item's own props remain stable. Combine with `loading="lazy"` on images to further reduce initial resource contention.
