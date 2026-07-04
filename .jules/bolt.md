## 2026-07-04 - O(C * N^2) Bottleneck in Home.js
**Learning:** The `Home.js` component used a nested rendering pattern that filtered and deduplicated the entire food item list for every category on every render. With `C` categories and `N` items, the filtering and `.reduce` based deduplication resulted in an O(C * N^2) complexity within the render loop, which blocked the main thread as the dataset grew.
**Action:** Replace nested O(N^2) filtering/deduplication with an O(N) pre-processing step using `useMemo`. Use `Map` and `Set` for constant-time lookups and deduplication before rendering the JSX.

## 2026-07-04 - Cloudflare Workers Compatibility Fixes
**Learning:** Native `bcrypt` causes build failures in Cloudflare Workers because it requires Node.js binary bindings. Additionally, Node-specific modules like `fs` and `path` must be guarded when the app is intended for both Node and non-Node runtimes.
**Action:** Remove native `bcrypt` in favor of `bcryptjs` (pure JS). Use `isNode` guards (`typeof process !== 'undefined' && process.versions && process.versions.node`) to conditionally require Node-specific modules and execute server-only logic like `app.listen`.
