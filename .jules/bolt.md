## 2025-05-14 - Home.js O(N) Data Transformation
**Learning:** The Home.js screen was performing $O(N^2)$ operations within the render loop for category grouping and item deduplication, causing significant performance lag on larger datasets.
**Action:** Use `useMemo` to pre-calculate unique categories and group items into a `Map` by category name, reducing the complexity to $O(N)$ and providing near-instant lookups during rendering.

## 2025-05-14 - Cloudflare Workers Compatibility
**Learning:** Native dependencies (like `bcrypt`) and unguarded Node.js globals (`process.exit`, `require('fs')`, `require('redis')`) trigger build and runtime failures in non-Node environments like Cloudflare Workers.
**Action:** Use `bcryptjs` instead of `bcrypt`, and wrap all Node-specific calls in `isNode` guards. Export the Express app instance and wrap the `app.listen` call to prevent side-effects during bundling.
