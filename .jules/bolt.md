## 2026-04-14 - [Performance & CI Stabilization]
**Learning:** O(N^2) render loops are the primary cause of UI lag during search. Native 'bcrypt' is incompatible with Cloudflare Workers.
**Action:** Use 'useMemo' for O(N) data processing. Always prefer 'bcryptjs'. Use 'React.memo' for list items and search components.
