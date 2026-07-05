# Bolt's Performance Journal

## 2025-05-15 - Initial Performance Audit
**Learning:** Found several performance bottlenecks:
1. $O(N^2)$ deduplication inside the render loop in `Home.js`.
2. Sequential `await` calls in `OrderData.js` and `DisplayData.js`.
3. Missing database indexes on `email` for `User` and `DeliveredOrder` models.
4. Missing `loading="lazy"` on food item images.

**Action:** Decided to prioritize the `Home.js` optimization as it directly impacts UI responsiveness during search and initial load.

## 2025-05-15 - Functional Parity in Global vs Scoped Empty States
**Learning:** In `Home.js`, the original code showed "No Such Data Found" only if the global `foodItem` array was empty, not when a specific category search yielded no results. Re-implementing this using a Map-based optimization required careful placement of the conditional check to avoid displaying the message multiple times (once per category) during searches.
**Action:** Always verify empty-state behavior against the original implementation when refactoring nested render loops, as shifting logic from $O(N^2)$ to $O(N)$ can accidentally change the scope of conditional messages.

## 2025-05-15 - Cloudflare Workers Compatibility
**Learning:** Cloudflare Workers Builds fail if native Node.js modules (`fs`, `path`, `multer`) or native binary dependencies (`bcrypt`) are imported or accessed at the top level. Guarding these with an `isNode` check and removing incompatible dependencies like `bcrypt` in favor of pure-JS alternatives like `bcryptjs` is required for multi-runtime support.
**Action:** Consolidate `isNode` checks and ensure Node-specific logic is isolated to maintain build stability across environments.
