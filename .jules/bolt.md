## 2025-05-14 - React Hooks in IIFE
**Learning:** Calling `useMemo` or other hooks inside an Immediately Invoked Function Expression (IIFE) within a JSX block violates the "Rules of Hooks". Hooks must be at the top level of the function component.
**Action:** Always declare memoization hooks at the component's top level, even if the processed data is only used within a specific JSX sub-block.

## 2025-05-14 - Algorithmic Optimization for Render Loops
**Learning:** Nested filtering and deduplication in React render loops (e.g., $O(C \times N^2)$ where C is categories and N is items) causes significant lag as data grows.
**Action:** Use `useMemo` to pre-process data into efficient lookup structures like `Map` in $O(N)$ time.
