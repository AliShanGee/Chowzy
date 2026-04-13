## 2025-05-14 - O(N^2) Render-Loop in Home.js
**Learning:** The 'Home.js' screen used to perform expensive filtering and deduplication logic directly inside the render loop for each category. For 1000 items and 20 categories, this resulted in thousands of redundant operations on every render.
**Action:** Use 'useMemo' to pre-group and deduplicate items outside the render loop. This reduces the complexity from O(Categories * Items^2) to O(Items + Categories) by using Map-based lookups.

## 2025-05-14 - Preventing Global Re-renders with React.memo
**Learning:** Components like 'Card.js' were being re-rendered whenever any parent state (like the 'search' query in 'Home.js') changed, even if their own props hadn't changed.
**Action:** Wrap leaf components like 'Card' in 'React.memo' to ensure they only re-render when their specific props (foodItem, options) actually change.

## 2025-05-14 - Workers Builds: chowzy CI Failure (Bcrypt)
**Learning:** Cloudflare Workers environments often fail to build when native dependencies like 'bcrypt' are present, even if they aren't actively used in the worker script path. The project already has 'bcryptjs' (pure JS alternative) implemented across all routes.
**Action:** Remove the native 'bcrypt' dependency from 'package.json' files when 'bcryptjs' is available and already being used to ensure CI compatibility in serverless/worker environments.
