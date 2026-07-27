## 2025-07-27 - Parallelizing Independent Database Queries with Promise.all
**Learning:** Sequential await calls for independent database reads (e.g. Order.findOne and DeliveredOrder.find) create an unnecessary bottleneck, adding up their response latencies. Parallelizing them using Promise.all cuts latency down to the maximum of the query durations rather than their sum, improving API responsiveness.
**Action:** Always scan endpoint controllers for consecutive await queries and evaluate if they can be parallelized safely using Promise.all.
