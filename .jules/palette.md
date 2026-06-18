## 2025-05-23 - Semantic Toggles for Accessibility
**Learning:** Using non-semantic elements like `div` for interactive toggles prevents keyboard accessibility and screen reader recognition. Semantic `button` elements provide these features by default.
**Action:** Always use `<button type="button">` for toggles and icon-only interactive elements, ensuring they have `aria-label` and visible focus indicators (`focus-ring`).
## 2025-05-23 - CI Failure: Native bcrypt
**Learning:** Native `bcrypt` causes build failures in Cloudflare Workers environments. `bcryptjs` is the mandatory alternative.
**Action:** Always use `bcryptjs` instead of `bcrypt` and ensure `bcrypt` is removed from all `package.json` files.
## 2025-05-23 - CI Failure: Node.js Globals in Workers
**Learning:** Cloudflare Workers do not support certain Node.js globals (e.g., `process.env`, `process.exit`, `require('dotenv')`) or filesystem modules (`fs`) during bundling.
**Action:** Guard Node.js-specific logic with an `isNode` check (`const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;`) to ensure compatibility with Worker environments.
