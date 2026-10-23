# Bolt's Journal - Critical Learnings

## 2025-05-18 - Home Screen Item Filtering and Category Deduplication Optimization
**Learning:** Re-computing unique categories via array `.filter` and `.findIndex` on every render (including every search keystroke) along with quadratic `reduce((unique, item) => unique.some(...) ? unique : [...unique, item])` deduplication during category rendering causes noticeable UI jank on search input.
**Action:** Use `useMemo` for category deduplication, hoist `search.toLowerCase()` outside render loops, and replace quadratic deduplication with O(N) Set-based filtering.
