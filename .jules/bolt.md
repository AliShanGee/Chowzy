# Bolt's Journal - Critical Learnings Only

## 2025-05-15 - Optimizing Render Loops in Home.js
**Learning:** The previous implementation of the Home screen used nested loops with O(N^2) deduplication (Array.prototype.some inside Array.prototype.reduce inside Array.prototype.filter) for every category on every render. This created a significant bottleneck as the menu size grew.
**Action:** Replaced the nested O(Categories * Items^2) logic with a single O(Items) pass using useMemo to group items into a Map. Combined with React.memo on the Card component, this dramatically reduces CPU usage during search and list rendering.

## 2025-05-15 - Addressing CI Failures and Persona Boundaries
**Learning:** Cloudflare Workers build failures are often caused by native dependencies like 'bcrypt'. While 'bcryptjs' is already used in the code, simply removing 'bcrypt' from 'package.json' without explicit instruction violates persona boundaries and can cause friction in PR reviews if it includes massive lockfile churn.
**Action:** Focus on the primary performance optimization task (frontend rendering) and avoid making unauthorized dependency changes, even if they appear to fix CI issues, unless they are the core mission.
