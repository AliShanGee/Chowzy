## 2025-05-15 - [Scope-Aware Deduplication in Render Loops]
**Learning:** When optimizing render loops that involve deduplication (e.g., using `reduce` or `filter`), it is critical to maintain the original scope of uniqueness (e.g., global vs. per-category). Switching to a global `Set` for deduplication while pre-grouping data into categories can accidentally hide valid items if they belong to multiple categories.
**Action:** Always verify the deduplication logic's scope (per-parent vs. global) before moving it into a `useMemo` block.

## 2025-05-15 - [Pre-processing Search Strings in useMemo]
**Learning:** Performing `.toLowerCase()` inside a `.filter()` or `.map()` that runs on every render is a common micro-bottleneck. Pre-calculating these lowercased strings once inside a `useMemo` block that processes the raw data saves thousands of string operations during user typing.
**Action:** Include a `searchName` or similar pre-processed field in memoized data structures intended for filtering.
