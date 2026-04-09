## 2025-05-14 - [React Context Subscription & Memoization]
**Learning:** Components subscribing to a large Context (like `useCart`) will re-render on *every* context change, even if they only use a subset of the context or just the dispatch function. In this app, every `Card` was re-rendering whenever *any* item was added to the cart because they were all subbed to the full cart state.
**Action:** Use specialized hooks for dispatch if available (like `useDispatchCart`) and wrap frequently rendered items in `React.memo`. Always verify if a context hook is actually needed for rendering logic.

## 2025-05-14 - [Expensive Render Calculations]
**Learning:** Nested array operations (filter/find/map) inside the render body of a main screen (like `Home.js`) cause noticeable lag during state updates (e.g., search typing).
**Action:** Use `useMemo` to stabilize data structures derived from props/state, especially when dealing with category-item mappings.

## 2025-05-14 - [Native Dependencies in Serverless Environments]
**Learning:** Native dependencies like `bcrypt` often cause build failures in serverless/worker environments (e.g., Cloudflare Workers) due to compilation requirements. `bcryptjs` is a safer, pure-JS alternative.
**Action:** Prefer pure-JS alternatives for native modules in serverless-targeted codebases. Avoid adding native dependencies to projects that deploy to Cloudflare Workers or similar environments.
