## 2025-04-18 - Nested Deduplication Bottleneck in Render Loops
**Learning:** Performing array filtering and deduplication (using `.reduce` with `.some`) inside a `.map` loop creates O(Categories * Items^2) complexity. For a large menu, this significantly blocks the main thread during every keystroke in the search bar.
**Action:** Pre-process and group data using a `Map` within `useMemo`. This reduces the complexity to O(Items) and keeps the render loop lean. Combine this with `React.memo` on child components to prevent redundant renders of non-changing items.
