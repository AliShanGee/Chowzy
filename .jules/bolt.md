## 2025-02-23 - Linear Deduplication & Card Memoization in Home Screen
**Learning:** Home screen re-renders during search keystrokes suffered from O(N^2) category deduplication (`findIndex`) and O(K^2) item deduplication (`reduce` with `some` & array spreading), plus unmemoized `Card` components re-rendering framer-motion tilt effects.
**Action:** Use `Set`-based linear O(N) deduplication inside `useMemo`/`useCallback` for nested list filtering, and wrap card components in `React.memo` with a custom `arePropsEqual` comparator.
