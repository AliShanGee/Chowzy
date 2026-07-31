## 2025-07-31 - React.memo and useMemo performance refactoring in Home.js and Card.js
**Learning:** Nested array operations like O(C * N^2) filtering and deduplication in the render path of heavy parent screens cause major UI lag on frequent state changes such as search keystrokes.
**Action:** Lift unique item extraction and category-key grouping into O(N) useMemo hooks, and wrap expensive item child components (like Card) in memo to ensure their props stay referentially stable and avoid redundant updates.
