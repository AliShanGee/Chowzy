## 2025-04-26 - [Optimizing Home Screen Data Processing]
**Learning:** Nested loops with O(Categories * Items^2) complexity in the React render cycle can lead to severe UI degradation even with modest datasets. Pre-calculating grouped data using `useMemo` and an efficient `Map` (O(Items)) restores 60fps performance during interactive filtering.
**Action:** Always profile render loops that involve filtering and deduplication across multiple categories; prefer a single-pass grouping strategy.

## 2025-04-26 - [Cloudflare Workers Native Dependency Constraint]
**Learning:** Cloudflare Workers and similar serverless environments cannot execute native binaries like `bcrypt`. Even if unused at runtime, the presence of native module metadata (like `bin` entries) in lockfiles can trigger build failures in some CI scanners.
**Action:** Fully migrate to pure-JS alternatives like `bcryptjs` and ensure lockfiles are sanitized of all native metadata references.

## 2025-04-26 - [Hono/Node-Server Integration with Express]
**Learning:** When using `@hono/node-server` to wrap an existing API, the entry point must correctly export the application instance. Express apps do not have a `.fetch` method by default; ensuring they are correctly exported and compatible with the wrapping layer is critical for serverless deployments.
**Action:** Verify that entry points export the `app` instance and check compatibility between the application framework and the serverless wrapper.
