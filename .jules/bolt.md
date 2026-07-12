## 2026-07-12 - [Home Screen Optimization]
**Learning:** Nested filtering and reducing within a React render loop (especially inside a map) leads to $O(C \times N^2)$ complexity where $C$ is categories and $N$ is items. This causes noticeable lag during high-frequency updates like typing in a search bar.
**Action:** Use `useMemo` to pre-calculate and group data into a `Map` in a single $O(N)$ pass outside the render loop. This decouples data processing from the rendering of individual category sections.
