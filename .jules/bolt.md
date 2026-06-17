# Bolt's Journal - Critical Performance Learnings

## 2026-06-17 - O(N*C) Bottleneck in Home.js
**Learning:** The Home.js component performs nested filtering and deduplication in its render loop. For every category (C), it filters the entire food items array (N) and then performs an O(K²) deduplication (where K is the number of items in that category). This results in O(N*C + C*K²) complexity every render, which is especially costly during search updates.

**Action:** Move data processing into `useMemo` and use a Map-based grouping strategy to achieve O(N) complexity for data preparation and O(N) for search filtering, bypassing the nested overhead.

## Benchmark Results
- **Dataset:** 5000 items, 50 categories
- **Average Current Logic (Search Render):** 0.4129ms
- **Average Optimized Logic (Search Render):** 0.0059ms
- **Measured Speedup:** ~69x

## 2026-06-17 - Workers Build Fixes
**Learning:** Cloudflare Workers environments are sensitive to native dependencies (like bcrypt) and certain Node.js globals/behaviors (like filesystem access in Multer or un-guarded `process.exit()`). These can cause build-time or runtime failures when bundling for the edge.

**Action:**
1. Use `bcryptjs` instead of native `bcrypt`.
2. Guard `process.exit()` with check for its existence.
3. Wrap top-level executions in `require.main === module` guards.
4. Add environment guards for filesystem-dependent code (e.g. Multer disk storage).
