## 2025-01-24 - [O(N^2) Render Loop Optimization]
**Learning:** Performing data grouping and deduplication inside the render loop (nested `.map`, `.filter`, `.reduce`) creates a scaling bottleneck as the number of items or categories grows. For 5,000 items, this caused a significant delay (~10ms per render), which adds up quickly during high-frequency events like typing in a search bar.
**Action:** Always move data transformations (grouping, filtering by category) into `useMemo` to ensure they only run when the source data changes. Use a `Map` for $O(1)$ lookups instead of repeated array filtering ($O(N)$).

## 2025-01-24 - [React.memo and Lazy Loading]
**Learning:** Components that are part of a large list (like `Card.js`) can cause "death by a thousand cuts" if they re-render unnecessarily on every parent state change (like a search input).
**Action:** Use `React.memo` on list items to skip re-renders when props haven't changed. Combine with `loading="lazy"` on images to improve initial paint performance and reduce network contention.
