## 2026-09-21 - Route-Based Code Splitting in App.js
**Learning:** Static route imports in single-page React apps bundle heavy dependencies like `react-admin` and `recharts` into the initial bundle even if the user lands on `/`. Dynamic imports (`React.lazy`) with `Suspense` isolate route components into separate chunks, cutting main bundle size by ~78%.
**Action:** Always lazy-load non-critical routes that pull in large dependencies to ensure fast initial page loads.
