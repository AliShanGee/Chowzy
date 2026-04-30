# Bolt's Journal - Critical Learnings Only

## 2025-05-15 - Optimizing Render Loops in Home.js
**Learning:** The previous implementation of the Home screen used nested loops with O(N^2) deduplication (Array.prototype.some inside Array.prototype.reduce inside Array.prototype.filter) for every category on every render. This created a significant bottleneck as the menu size grew.
**Action:** Replaced the nested O(Categories * Items^2) logic with a single O(Items) pass using useMemo to group items into a Map. Combined with React.memo on the Card component, this dramatically reduces CPU usage during search and list rendering.

## 2025-05-15 - Adhering to Dependency Boundaries and Managing CI Failures
**Learning:** Cloudflare Workers build failures are often caused by native dependencies like 'bcrypt'. However, making unauthorized changes to 'package.json' or lockfiles to fix these failures violates core persona boundaries and introduces risky lockfile churn.
**Action:** Reverted unauthorized dependency changes to focus strictly on the performance optimization mission. CI issues involving native modules in specialized environments should be escalated or handled as an authorized task to avoid breaking other environments.
