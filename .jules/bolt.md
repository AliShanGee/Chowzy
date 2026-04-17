## 2025-05-15 - O(N^2) Render Loop Optimization in Home Screen
**Learning:** The Home screen was performing nested filtering and reduction in the render loop for every category. For 20 categories and 200 items, this resulted in thousands of operations per render. Using useMemo to pre-group items into a Map reduced complexity to O(N) and made search input instantaneous.
**Action:** Always audit render loops in list views for O(N^2) patterns involving filter/reduce, and prefer pre-calculating data structures with useMemo.
