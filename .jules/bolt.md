## 2025-05-15 - Unindexed schemas and sequential fetches in /myOrderData
**Learning:** Found that key schemas (`User` and `DeliveredOrder`) were completely unindexed on fields used for high-frequency queries (like `email`). Additionally, sequential `await` calls in `/myOrderData` were causing unnecessary blocking wait times since the queries for active and delivered orders were independent.
**Action:** Always verify if database schemas have indexes on frequently queried/sorted fields, and parallelize independent queries using `Promise.all` to minimize response latency.
