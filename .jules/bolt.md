## 2025-05-15 - [O(N) Grouping in Home.js]
**Learning:** The original Home.js implementation performed nested O(N) filters and O(N) deduplication within a map loop, effectively resulting in O(N^2) or worse performance during search filtering. By moving item grouping and deduplication into a single O(N) Map-based pass inside useMemo, we decoupled the heavy data structuring from the render loop.
**Action:** Use multi-stage memoization to separate data preparation (grouping/deduplication) from high-frequency state filtering (search) to maintain O(Items) efficiency during user input.
