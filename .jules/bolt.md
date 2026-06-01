## 2025-05-15 - [Optimize Home screen data processing]
**Learning:** Performing O(N²) deduplication (using `reduce` with `some`) inside a render loop that iterates over categories results in O(N*M^2) complexity, which significantly degrades performance as the food item list grows.
**Action:** Use `useMemo` to pre-calculate unique categories and replace nested O(N²) logic with O(N) `Set`-based deduplication to ensure the UI remains responsive even with large datasets.
