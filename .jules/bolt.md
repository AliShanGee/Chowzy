## 2025-08-05 - Optimizing Nested Category and Item Rendering with Map
**Learning:** Inline arrays filters, deduplication via recursive indices (`findIndex`), and mapping logic inside React JSX execute on every render, even for unrelated state changes (e.g., theme toggle). This creates O(C * N^2) or O(C * N * M) bottlenecks.
**Action:** Lift nested item rendering, deduplication, and category grouping into dedicated, single-pass O(N) memoization hooks (`useMemo`) that group elements into a Map. This cuts render-time recalculation down to O(1) map lookups on subsequent re-renders.
