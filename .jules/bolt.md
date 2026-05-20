## 2025-05-15 - [O(N) Grouping for Food Categories]
**Learning:** In scenarios where items are grouped by category (e.g., food items in a menu), using O(N^2) filtering logic (filtering the full item list for each category) causes significant UI lag as the dataset grows. A single-pass O(N) grouping strategy using a Map or Object indexed by category reduces complexity linearly and eliminates redundant iterations.
**Action:** Always prefer indexing/grouping data in a single pass (using `useMemo`) before rendering nested list structures.

## 2025-05-15 - [Eliminating State Re-renders in Card Components]
**Learning:** Initializing state via `useEffect` after mount (e.g., `useEffect(() => setSize(props.options[0]), [])`) triggers an immediate second render cycle, causing a "flash" of uninitialized content.
**Action:** Initialize state directly from props in `useState(() => props.options[0])` to ensure the correct state is available on the very first render.
