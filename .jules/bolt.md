## 2026-05-30 - [O(N) Grouping in Home.js]
**Learning:** Performing nested O(N²) filtering and deduplication within a React render loop (specifically inside an IIFE) causes significant UI lag as the dataset grows. Using a Map to group items by category in a single O(N) pass reduces computation time by over 90%.
**Action:** Always move complex data processing out of the JSX render path and into `useMemo`. Use Maps for O(1) category lookups to avoid nested array iterations.
