## 2025-05-14 - Optimized Home.js Data Processing
**Learning:** Performing O(N²) data processing (nested filtering and deduplication with `reduce` + `some`) inside the React render loop causes significant UI lag, especially during active search.
**Action:** Use `useMemo` to pre-process data into an O(N) hash map (grouping items by category) once per data update, allowing the render loop to perform O(1) lookups.

## 2025-05-14 - Redundant Re-render in Card Component
**Learning:** Initializing state with an empty value and immediately updating it in `useEffect` (e.g., for props-derived values) causes an unnecessary second render cycle for every instance of the component.
**Action:** Initialize state directly from props/data in the `useState` call to ensure the initial render is correct and avoid the post-mount update cycle.

## 2025-05-14 - Cloudflare Workers Compatibility
**Learning:** Cloudflare Workers (chowzy) builds fail when native dependencies like `bcrypt` are present, even if not directly required in the worker path. Additionally, the entry point must correctly export the application and ensure any Node-specific operations (like `fs`) are guarded.
**Action:** Prefer `bcryptjs` for cross-environment compatibility. Ensure the Express app is exported and initialize database/redis connections using an `app.init()` pattern that can be called before starting the server or within the worker's lifecycle.
