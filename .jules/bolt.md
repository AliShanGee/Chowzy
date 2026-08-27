## 2026-08-27 - Home Component Memoization & Cloudflare Workers Compatibility

**Learning:** In Cloudflare Workers deployments, native C++ packages like `bcrypt` cause build/deployment crashes. Furthermore, paginated screens rendering list items across categories cause heavy render lag when performing inline $O(N^2)$ category deduplication and item filtering on every render pass.

**Action:** Replace native `bcrypt` with `bcryptjs` for Cloudflare Workers compatibility and split memoization into separate `useMemo` hooks for category pagination and linear $O(N)$ item grouping using `Set` lookup maps.
