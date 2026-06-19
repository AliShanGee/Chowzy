## 2025-05-14 - Home page grouping optimization
**Learning:** Replaced O(C * N) nested filtering in JSX (where C is number of categories and N is number of food items) with a single O(N) grouping pass in `useMemo`. This significantly improves UI responsiveness when typing in the search bar, as it avoids re-filtering the entire dataset for every category on every keystroke.
**Action:** Use Map-based grouping and `useMemo` for large datasets instead of performing filtering/deduplication logic directly inside the render loop or JSX.

## 2025-05-14 - Card initialization optimization
**Learning:** Initializing state from props in `useState`'s initializer function prevents an extra post-mount render that would otherwise be caused by setting the state in `useEffect`.
**Action:** Always prefer lazy state initialization or direct initialization from props over `useEffect` for setting initial component state that depends on props.
