## 2025-05-15 - [Scope-Aware Deduplication in Render Loops]
**Learning:** When optimizing render loops that involve deduplication (e.g., using `reduce` or `filter`), it is critical to maintain the original scope of uniqueness (e.g., per-category). Moving deduplication to a global useMemo without category scoping can hide valid items.
**Action:** Always verify the deduplication logic's scope before moving it into a `useMemo` block.

## 2025-05-15 - [Pre-processing Search Strings in useMemo]
**Learning:** Performing `.toLowerCase()` inside a `.filter()` or `.map()` that runs on every render is a common micro-bottleneck. Pre-calculating these lowercased strings once inside a `useMemo` block saves redundant operations.
**Action:** Include a `searchName` field in memoized data structures for efficient search filtering.
