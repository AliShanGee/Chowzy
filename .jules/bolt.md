## 2025-05-18 - Avoid O(C * N + C * K^2) Nested Filtering and Array Copying in React Render Loops

**Learning:** Running inline `.filter` and `.reduce` with `.some` and array spreading (`[...unique, item]`) inside category render loops forces quadratic time complexity O(K^2) per category and repeated O(N) linear scans on every render (e.g. keypresses in search bar).
**Action:** Use a single-pass `useMemo` hook with a `Set` for deduplication and a Map/hash lookup object to pre-group items by category in O(N) time.
