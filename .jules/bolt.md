## 2025-03-03 - API Query Parallelization with Promise.all
**Learning:** Sequential await calls on independent database queries (e.g., fetching categories and food items separately, or fetching active and delivered orders separately) introduces unnecessary serial network/DB latency. Combining them into `Promise.all` executes them in parallel, reducing response latency by up to 50%.
**Action:** Always scan API routes for independent `await` queries and parallelize them using `Promise.all`.
