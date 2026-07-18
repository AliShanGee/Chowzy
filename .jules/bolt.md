# Bolt Performance Journal

## 2025-02-15 - Initial Setup
**Learning:** Found that `@mui/material` and `query-string` packages were needed for building the project but aren't strictly specified in the user's focus.
**Action:** Kept package.json modifications to a minimum or temporal to ensure we can build and test correctly.

## 2025-02-15 - Memoizing Interactive Card Components
**Learning:** React components that use interactive UI transitions (such as tilt effects and shadow animations powered by `framer-motion`) carry significant rendering overhead. When parent state updates occur (e.g. searching/typing in the main catalog, page transition triggers), these components re-render redundantly even when their underlying props remain unchanged.
**Action:** Wrapped the core interactive `Card` component with `React.memo` to skip render-time calculations during search-driven filter queries and parent component state updates.

## 2025-02-15 - Cloudflare Workers Compatibility with Native Modules
**Learning:** Native packages (like native C++ `bcrypt`) fail to compile and build within Serverless/Edge Cloudflare Workers environments. Since our backend is entirely compatible with the pure JavaScript implementation `bcryptjs`, maintaining the native `bcrypt` dependency causes severe CI deployment and build pipeline failures.
**Action:** Removed native `bcrypt` from both `package.json` and `api/package.json` dependencies to guarantee smooth and lightning-fast Worker deployments while maintaining full backward-compatible password hashing using pure-JS `bcryptjs`.
