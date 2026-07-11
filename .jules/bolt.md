## 2025-07-11 - O(N) Data Processing in Home.js

**Learning:** The previous implementation used nested filtering and deduplication within the render loop, resulting in O(C * N^2) complexity where C is the number of categories and N is the number of food items. This caused noticeable lag during search input as the entire dataset was re-processed multiple times per render.

**Action:** Lifted data processing into `useMemo` hooks using `Map` and `Set` data structures. By pre-processing items into a category-keyed `Map` in a single O(N) pass, we reduced the per-category lookup to O(1) (average), significantly improving UI responsiveness during state updates. Always prefer pre-calculating indexed data structures over nested array traversals in React render paths.
