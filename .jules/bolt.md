## 2025-05-30 - Route-level code splitting with React.lazy and Suspense
**Learning:** The application was bundling heavy admin components (react-admin, Material-UI, react-router v6 admin routes) directly into the main entry bundle, causing an initial gzipped bundle of ~1.78 MB.
**Action:** Splitting top-level route screens with React.lazy and Suspense drastically cuts initial bundle download by ~80% (to ~359 kB) while preserving clean route navigation.
