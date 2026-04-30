# Bolt's Journal - Critical Learnings Only

## 2025-05-15 - Optimizing Render Loops in Home.js
**Learning:** The previous implementation of the Home screen used nested loops with (N^2)$ deduplication (.prototype.some$ inside .prototype.reduce$ inside .prototype.filter$ inside .prototype.map$) for every category on every render. This created a significant bottleneck as the menu size grew.
**Action:** Replaced the nested (Categories \times Items^2)$ logic with a single (Items)$ pass using $ to group items into a $. Combined with .memo$ on the $ component, this dramatically reduces CPU usage during search and list rendering.

## 2025-05-15 - Lockfile Hygiene and Build Verification
**Learning:** Running  install$ in an environment with missing dependencies can generate a massive -lock.yaml$ that creates noise in PRs. Also, build logs should never be committed.
**Action:** Strictly avoid committing lockfiles or logs unless explicitly required. Ensure the environment is clean before submission.
