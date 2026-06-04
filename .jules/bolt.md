## 2025-05-14 - Optimized Home.js Data Processing
**Learning:** Performing O(N²) data processing (nested filtering and deduplication with `reduce` + `some`) inside the React render loop causes significant UI lag, especially during active search.
**Action:** Use `useMemo` to pre-process data into an O(N) hash map (grouping items by category) once per data update, allowing the render loop to perform O(1) lookups.

## 2025-05-14 - Redundant Re-render in Card Component
**Learning:** Initializing state with an empty value and immediately updating it in `useEffect` (e.g., for props-derived values) causes an unnecessary second render cycle for every instance of the component.
**Action:** Initialize state directly from props/data in the `useState` call to ensure the initial render is correct and avoid the post-mount update cycle.
