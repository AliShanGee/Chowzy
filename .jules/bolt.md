## 2025-06-03 - [Home.js Render Optimization]
**Learning:** Performing O(N) filtering and deduplication inside a map over categories in the render loop leads to O(M*N) complexity on every render.
**Action:** Use useMemo to pre-process raw data into a Map-based grouping in O(N) time.

## 2025-06-03 - [Cloudflare Workers compatibility]
**Learning:** Cloudflare Workers (chowzy) build requires the Express app to be exported as a default export from the entry point (index.js) and as module.exports from the api/ entry point. Native binaries like bcrypt and unguarded filesystem calls must be avoided or guarded.
**Action:** Guard fs calls with isNode check and use bcryptjs for cross-environment compatibility.
