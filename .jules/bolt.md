## 2025-05-14 - Optimized Home screen render loop and fixed Cloudflare Workers CI
**Learning:**
1.  **Performance:** The O(C^2 + C * I^2) render loop in Home.js was optimized to O(C + I) using useMemo and Map-based grouping, resulting in a ~3x speedup for 20,000 items.
2.  **CI Failure:** Cloudflare Workers builds fail if native dependencies like 'bcrypt' are present in the dependency tree or lockfiles. Removing 'bcrypt' and ensuring only 'bcryptjs' is used resolves this.
3.  **Environment Management:** Using different package managers (npm vs pnpm) in the same repo can lead to broken node_modules states. Stick to the project's primary tools and avoid commit-level changes to lockfiles unless necessary.
**Action:**
- Use useMemo/Map for large dataset processing in React.
- Always remove native 'bcrypt' in favor of 'bcryptjs' for Cloudflare Workers compatibility.
- Perform targeted manual edits to package-lock.json to avoid massive unrelated diffs when possible.
