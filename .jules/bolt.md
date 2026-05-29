## 2025-05-15 - React Render Loop Bottleneck
**Learning:** Performing O(N*M^2) data processing (nested filtering and deduplication) inside the JSX/render block of a main screen (Home.js) causes significant UI jank during search interactions as the dataset grows.
**Action:** Use `useMemo` to pre-calculate and group data into Map/Object structures outside the render loop, reducing complexity to O(M) for the main iteration.
