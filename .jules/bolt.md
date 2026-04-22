## 2025-05-15 - Render Loop Complexity Optimization
**Learning:** Nested array methods (filter, reduce, some) inside a React component's render loop can lead to O(N^2) or worse complexity, causing noticeable lag as data grows. Using a Map for O(1) lookups and useMemo to pre-process data outside the render loop is a highly effective pattern for this codebase.
**Action:** Always check for nested loop patterns in main UI screens like Home or Dashboard and refactor to use Map/Set with useMemo.
