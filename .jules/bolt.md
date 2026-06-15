# Bolt's Journal - Performance Learnings

## 2025-05-15 - Home.js O(N*C) vs O(N) Data Processing
**Learning:** The Home.js component performs nested filtering and deduplication within the render loop, leading to O(N*C) or O(N^2) complexity. This significantly slows down the UI during search updates and page transitions.
**Action:** Use `useMemo` to pre-calculate filtered and grouped data in O(N) time using a Map/Set, reducing the computational overhead during renders.

## 2025-05-15 - Card.js Redundant Re-renders
**Learning:** High-frequency state updates in parent components (like search in Home.js) trigger re-renders of all child components (Card.js), even if their props remain unchanged.
**Action:** Wrap leaf components like `Card.js` in `React.memo` to prevent unnecessary re-renders and improve interaction responsiveness.

## 2025-05-15 - Missing Database Indexes
**Learning:** Frequent queries on non-indexed fields (like `email` in `DeliveredOrders`) lead to full collection scans, which degrade performance linearly as the database grows.
**Action:** Ensure frequently queried fields have appropriate indexes at the schema level.
