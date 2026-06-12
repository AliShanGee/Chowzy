## 2026-06-12 - [O(N) Grouping vs O(N*C) Nested Filtering]
**Learning:** In `Home.js`, filtering food items by category inside a loop over categories resulted in O(N*C) complexity. On a dataset of 5000 items and 100 categories, this caused a significant render-loop bottleneck (~1.1s processing time).
**Action:** Use `useMemo` with a single-pass O(N) Map-based grouping strategy to pre-process data before rendering. This reduced execution time to ~50ms in synthetic benchmarks.

## 2026-06-12 - [CI Failure: Native bcrypt in Cloudflare Workers]
**Learning:** Cloudflare Workers (chowzy) build fails when native binaries like `bcrypt` are present in `package.json`, even if not directly used in the worker script. The project already uses `bcryptjs` for cross-environment compatibility.
**Action:** Removed native `bcrypt` from all `package.json` files and ensured `bcryptjs` is the sole hashing dependency to satisfy CI constraints.
