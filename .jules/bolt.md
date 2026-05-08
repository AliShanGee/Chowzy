## 2024-11-20 - Multi-stage Memoization for Large Dataset Processing
**Learning:** In screens like `Home.js` that process large arrays (categories and items) with nested filtering and deduplication, performing these operations directly in the render loop leads to O(N²) or even O(N*M) complexity. This causes significant UI lag during state updates like search input. Using a multi-stage `useMemo` approach—first deduplicating categories and then pre-grouping items into a `Map` in O(N) time—drastically improves performance by decoupling heavy data transformation from the actual rendering.
**Action:** Always check for nested `filter`, `some`, or `reduce` calls within render loops. Replace them with `useMemo` and `Map`/`Set` based lookups to achieve O(N) efficiency.

## 2024-11-20 - Native Lazy Loading vs. Virtualization
**Learning:** For a food delivery app with many item images, adding native `loading="lazy"` to images is a low-effort, high-impact optimization that reduces initial bandwidth and improves Largest Contentful Paint (LCP) without the complexity of a full virtualization library.
**Action:** Default to `loading="lazy"` for images that are likely to appear below the fold, especially in grid-based layouts.
