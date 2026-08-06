## 2025-08-06 - Per-Category De-duplication in Map Optimization
**Learning:** When refactoring arrays with multiple logical grouping categories to a single `useMemo` pass mapping categories to lists, global de-duplication sets (`seenNames`) alter functional behavior by skipping unique occurrences across different categories. Checking uniqueness must use composite keys like `CategoryName_ItemName`.
**Action:** Always key seen-records checking by both category/scope and item identifier to preserve identical per-category list rendering behaviors during render pipeline optimization.
