# Bolt's Journal - Critical Learnings Only

## 2025-05-15 - Optimizing Render Loops in Home.js
**Learning:** The previous implementation of the Home screen used nested loops with O(N^2) deduplication (Array.prototype.some inside Array.prototype.reduce inside Array.prototype.filter) for every category on every render. This created a significant bottleneck as the menu size grew.
**Action:** Replaced the nested O(Categories * Items^2) logic with a single O(Items) pass using useMemo to group items into a Map. Combined with React.memo on the Card component, this dramatically reduces CPU usage during search and list rendering.

## 2025-05-15 - Adhering to Dependency Boundaries
**Learning:** Even if native dependencies like 'bcrypt' cause CI failures in specific environments (like Cloudflare Workers), modifying 'package.json' or lockfiles without explicit instruction violates persona boundaries and introduces risky lockfile churn.
**Action:** Reverted dependency changes to focus purely on the frontend performance optimization. CI failures related to native modules should be addressed as a separate, authorized task.
