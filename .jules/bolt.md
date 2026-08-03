## 2026-08-03 - Paginated Page-Level Rendering Optimization
**Learning:** Globally grouping and filtering 5,000 items in a single `useMemo` pass across all categories actually performed *worse* than the unoptimized nested loops because the UI only renders 3 categories per page. Processing data for hidden categories wasted excessive CPU time.
**Action:** Always constrain data processing (grouping/filtering/deduplicating) in `useMemo` to ONLY the active categories on the current page to ensure actual rendering efficiency matches theoretical computational gains.
