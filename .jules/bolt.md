## 2026-10-16 - Memoization & Set Lookup for Home Screen Search & Render
**Learning:** Re-evaluating $O(K^2)$ category array operations and $O(N^2)$ item deduplications (via `.reduce` + `.some`) inside React render functions on every search input keystroke causes frame drops and sluggish UI response.
**Action:** Use `useMemo` for category deduplication and single-pass $O(N)$ `Set` lookups with pre-lowercased search queries during item filtering.
