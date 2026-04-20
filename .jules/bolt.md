## 2025-05-14 - Optimized Home Screen Render Loop Complexity
**Learning:** Found an O(Categories * Items^2) bottleneck in the Home screen's render loop where food items were being filtered and deduplicated on every render. Benchmarking showed a ~17x speedup (283ms -> 16ms) by pre-grouping and deduplicating items using `useMemo`.
**Action:** Always check for nested filtering/deduplication logic inside `.map()` or render loops, especially when multiple state variables (like search and data) can trigger re-renders. Use `useMemo` to pre-calculate derivative data.
