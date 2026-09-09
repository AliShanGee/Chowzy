## 2025-03-09 - Reuse In-Memory Application Caches in AI Context Handlers
**Learning:** AI route handlers (like `AskAI.js`) that require full-menu context for RAG or grounding were executing sequential `FoodItem.find({}).lean()` database queries on every query, despite the application already maintaining an in-memory `global.food_items` cache populated at startup.
**Action:** Always check globally cached data structures (`global.food_items`) before hitting MongoDB in serverless or API route handlers, falling back to `.lean()` DB queries only when the cache is empty.
