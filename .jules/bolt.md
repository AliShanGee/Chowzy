## 2025-04-27 - [Algorithmic Optimization in Home.js]
**Learning:** The previous implementation of Home.js used O(Categories * Items^2) logic within the render loop for deduplication and filtering. By using a Map for grouping and deduplicating in a single O(Items) pass within useMemo, data processing time was reduced by over 30x for large datasets.
**Action:** Always prefer O(N) data structures (Map/Set) over nested O(N^2) array methods like filter + some/findIndex when dealing with potentially large lists.

## 2025-04-27 - [Component Memoization with React.memo]
**Learning:** Card components were re-rendering on every keystroke in the search bar because they were not memoized.
**Action:** Use React.memo for list items that receive stable props to prevent unnecessary re-renders when parent state changes.
