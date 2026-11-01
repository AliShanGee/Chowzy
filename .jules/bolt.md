## 2026-05-29 - O(C * N^2) Nested Render Loop Bottleneck in Home.js
**Learning:** `Home.js` was executing an $O(C^2)$ category deduplication and nested $O(C \times N)$ item filtering with quadratic $O(M^2)$ array reduction inside the JSX render tree on every keystroke, pagination event, and theme change.
**Action:** Lift data transformations into `useMemo` hooks using `Set` for $O(C)$ category deduplication and pre-index filtered items by category into a dictionary in a single $O(N)$ pass.
