## 2025-05-14 - Order Data Retrieval Optimization
**Learning:** Sequential await calls for independent database queries in Express routes create unnecessary latency. Compound indexes on fields frequently used together in sorts (like email and delivered_at) significantly improve query performance for historical data.
**Action:** Use Promise.all() for concurrent independent queries. Ensure critical lookup fields have appropriate indexes, especially in high-traffic routes like order history and authentication.
