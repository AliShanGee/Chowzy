## 2025-05-14 - [Environmental Noise and Lockfile Integrity]
**Learning:** During performance verification, environment-specific troubleshooting (like installing dependencies or starting a local server) can inadvertently modify lockfiles or create temporary logs.
**Action:** Always perform a `git status` and revert any unauthorized changes to `package-lock.json` or `api/package-lock.json` before submission, and ensure all temporary files (e.g., `server.log`, `benchmark_home.js`) are deleted.
