## 2025-05-14 - [React Context Subscription & Memoization]
**Learning:** Components subscribing to a large Context (like `useCart`) will re-render on *every* context change, even if they only use a subset of the context or just the dispatch function. In this app, every `Card` was re-rendering whenever *any* item was added to the cart because they were all subbed to the full cart state just to call a console log.
**Action:** Use specialized hooks for dispatch if available (like `useDispatchCart`) and wrap frequently rendered items in `React.memo`. Always verify if a context hook is actually needed for rendering logic.

## 2025-05-14 - [Expensive Render Calculations]
**Learning:** Nested array operations (filter/find/map) inside the render body of a main screen (like `Home.js`) cause noticeable lag during state updates (e.g., search typing).
**Action:** Use `useMemo` to stabilize data structures derived from props/state, especially when dealing with category-item mappings.
