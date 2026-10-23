## 2025-05-18 - Deduplication & Filter Optimization in Render Loops
**Learning:** In React components like `Home.js`, calling `.filter()` with `.findIndex()` ($O(K^2)$) or `.reduce()` with `.some()` and array spreading ($O(N^2)$) inside render loops creates unnecessary computational overhead and garbage collection pressure on every state change (e.g., search input keystrokes or pagination).
**Action:** Use `useMemo` for static dataset processing and substitute `Set`-based single-pass filters ($O(N)$) to eliminate nested array searches and array spreading allocations.
