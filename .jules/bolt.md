## 2025-05-14 - Optimized Home.js Render Loop
**Learning:** Inefficient deduplication and filtering inside a React render loop (using `reduce` and `some` nested within a category map) leads to $O(C \times N^2)$ complexity, where C is number of categories and N is number of items. This causes noticeable UI jank as the dataset grows.
**Action:** Use `useMemo` with `Map` and `Set` data structures to perform data grouping and deduplication in a single $O(N)$ pass, significantly reducing the computational overhead during renders.
