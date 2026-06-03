## 2025-06-03 - [ThemeToggle Accessibility]
**Learning:** Interactive elements implemented with `div` tags lack native keyboard support and screen reader recognition. Converting them to semantic `button` elements with `type="button"` and `aria-label` provides immediate accessibility wins.
**Action:** Always check for non-semantic wrappers (`div`, `span`) with `onClick` handlers and replace them with `<button type="button">`.

## 2025-06-03 - [Cloudflare Workers (chowzy) Compatibility]
**Learning:** Native binaries like `bcrypt` and filesystem operations (`fs.mkdirSync`, `express.static`) cause build or runtime failures in Cloudflare Workers environments.
**Action:** Use pure-JS alternatives like `bcryptjs` and wrap filesystem code in Node-specific environment checks (`process.versions.node`). Ensure the Express app is exported correctly from the entry point.

## 2025-06-03 - [Environment Guards for Workers]
**Learning:** Global objects like `process` and methods like `process.exit` or database count operations may throw or crash in serverless environments like Cloudflare Workers.
**Action:** Always guard `process.exit` calls and add `.catch()` to database operations that might fail during cold starts or build-time execution.
