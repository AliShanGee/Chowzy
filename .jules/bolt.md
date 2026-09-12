## 2025-05-20 - Mongoose Schema Indexes for Query Optimization
**Learning:** In Mongoose, querying or sorting on schema fields (such as `User.email`, `DeliveredOrders.delivered_at`, or `Reel.date`) without explicit `index: true` or `unique: true` causes MongoDB to perform full collection scans (`COLLSCAN`) and in-memory sorting (`SORT`), causing query latency to scale linearly O(N) with dataset growth.
**Action:** Always verify that schema fields used in frequent `.find()`, `.findOne()`, or `.sort()` queries are defined with `index: true` or `unique: true` in Mongoose models.
