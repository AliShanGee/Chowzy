## 2026-10-15 - Memoizing Category Grouping and Food Item Filtering
**Learning:** In Home.js, performing inline category deduplication (O(C^2) via findIndex) alongside inline food item filtering with quadratic array spreading (`reduce(... [...unique, item])`) on every render causes severe UI lag during typing in SearchBar.
**Action:** Use `useMemo` with a `Set` to deduplicate categories in O(C) and pre-index food items by category into a `Map` with `Set` uniqueness tracking in O(M) time, keeping subsequent search filtering linear and avoiding duplicate array allocations.
