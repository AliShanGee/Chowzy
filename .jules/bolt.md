## 2025-05-14 - Optimized Home screen data processing
**Learning:** The Home screen used an $O(N \cdot C)$ nested loop in the render function to filter and deduplicate food items by category. This caused noticeable lag when typing in the search bar as it re-ran for every category on every keystroke.
**Action:** Use `useMemo` to pre-process data in a single $O(N)$ pass, grouping items into a `Map` by category. This ensures the render loop only performs $O(1)$ lookups per category. Additionally, memoize child components like `Card` to prevent unnecessary re-renders when parent state updates.
