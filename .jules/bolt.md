## 2025-05-15 - Single-pass Set filtering vs O(N^2) reduce deduplication in React renders
**Learning:** Deduplicating array items in render methods using `.reduce((unique, item) => unique.some(...) ? unique : [...unique, item])` creates $O(N^2)$ comparisons and allocates new arrays on every matching element, causing significant GC pressure during input typing or pagination.
**Action:** Use a local `Set` within a single-pass `.filter()` callback to deduplicate items in $O(N)$ time with minimal memory allocations.
