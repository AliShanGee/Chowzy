## 2026-05-09 - [Native dependency CI failure]
**Learning:** Native dependencies like `bcrypt` trigger failures in Cloudflare Workers builds because they require environment-specific compilation that isn't supported in the Workers runtime.
**Action:** Always prefer pure JavaScript alternatives like `bcryptjs` when targeting Cloudflare Workers, and ensure native packages are removed from `package.json` and `package-lock.json` to prevent CI blockers.

## 2026-05-09 - [Render Loop Optimization]
**Learning:** Nested array operations (filter, some, findIndex) inside a render loop lead to O(N^2) or O(M*N) complexity, causing UI lag during high-frequency updates like search input.
**Action:** Use `useMemo` to pre-process and group data into hash maps (O(N)) outside the render loop.
