## 2025-05-18 - Linear Set-based item deduplication and Card memoization on Home screen

**Learning:** In `Home.js`, nested `.filter().reduce()` with `.some()` inside the render loop created quadratic $O(N^2)$ array allocations and linear string lowercasing on every search keystroke, while unmemoized `Card` components forced expensive Framer Motion spring re-calculations across all visible items.
**Action:** Replace $O(N^2)$ array scanning with a linear $O(N)$ `Set` filter and memoize `Card` with `React.memo` and `useMemo` for price options to prevent unnecessary re-renders when parent search or theme state changes.
