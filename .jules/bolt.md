## 2025-05-14 - Optimize Home feed rendering and prevent Card re-renders
**Learning:** Found O(Categories * Items^2) complexity in the Home screen render loop due to nested filter/reduce on every render.
**Action:** Used useMemo to pre-process items into a Map for O(Items) grouping and O(1) lookup. Wrapped leaf components (Card) in React.memo to prevent global re-renders during search typing.

## 2025-05-14 - Build Correctness vs. Micro-optimization
**Learning:** Native 'bcrypt' causes Cloudflare Workers build failures. Although 'bcryptjs' is slower, it is necessary for the application to function in the target environment.
**Action:** Prioritize build-compatibility over micro-benchmarks when a dependency prevents deployment, but acknowledge the trade-off.
