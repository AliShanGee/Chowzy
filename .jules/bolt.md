## 2026-04-12 - [Optimizing Render Loop Complexity]
**Learning:** Nested O(N^2) operations in React render loops (filtering/deduplicating items per category) cause significant lag during search/input as the data set grows. Pre-grouping and deduplicating data via useMemo reduces the per-render complexity to O(Filtered Items).
**Action:** Always pre-process flat lists into hashed maps (grouped by category/ID) using useMemo when rendering nested lists.

## 2026-04-12 - [CI Compatibility for Serverless]
**Learning:** Native dependencies like 'bcrypt' often fail in restricted CI environments (like Cloudflare Workers) due to lack of build tools for native compilation.
**Action:** Prefer pure-JavaScript alternatives like 'bcryptjs' for cross-platform and serverless compatibility.
