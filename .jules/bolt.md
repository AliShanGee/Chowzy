# Bolt's Performance Journal

## 2025-05-14 - Optimized Home.js Render Loop
**Learning:** The `Home.js` component used a nested $O(C \times N^2)$ logic for filtering and deduplicating food items within a category loop. This is a common performance anti-pattern in React that leads to significant UI lag with large datasets.
**Action:** Use `useMemo` to pre-process data into a Map or Object for $O(1)$ lookup during render, bringing the overall complexity down to $O(N)$.

## 2025-05-14 - Concurrent Database Queries
**Learning:** Sequentially awaiting multiple database queries (e.g., `food_items` and `foodCategory`) in API routes adds unnecessary latency.
**Action:** Always use `Promise.all` for independent database queries to reduce total response time.
