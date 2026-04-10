## 2026-04-10 - [Performance optimization in Home.js]
**Learning:** Improving performance in 'Home.js' by using 'useMemo' to transform food items into category-grouped data, optimizing the render-loop complexity from O(Categories * Items^2) down to O(Items + Categories). Also memoizing 'Card' component to prevent global re-renders on state updates.
**Action:** Always check for expensive computations (filtering, deduplication) inside React render loops and move them to 'useMemo'. Use 'React.memo' for list items in high-frequency update components.
