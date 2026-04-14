## 2026-04-14 - [Optimizing Food Item Rendering & Fixing CI]
**Learning:** Native 'bcrypt' causes build failures in Cloudflare Workers environment. Using 'useMemo' to pre-group and deduplicate items in 'Home.js' reduces render loop complexity from O(N^2) to O(N).
**Action:** Always prefer 'bcryptjs' for Cloudflare Workers projects. Use 'useMemo' for expensive data processing in render functions.
