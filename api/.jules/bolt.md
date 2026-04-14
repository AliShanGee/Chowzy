## 2026-04-14 - [Home Screen Optimization & CI Fix]
**Learning:** O(N^2) render-loop logic in 'Home.js' significantly impacts responsiveness. Native 'bcrypt' causes Cloudflare Workers build failures. 'query-string' requires specific import structure.
**Action:** Use 'useMemo' for Map-based grouping and deduplication. Always prefer 'bcryptjs'. Ensure stable component references with 'React.memo' to prevent redundant re-renders.
