## 2026-08-31 - Bypass Mongoose Document Hydration for Read API Queries
**Learning:** Returning plain JS objects using `.lean()` on Mongoose `find()` operations significantly reduces memory overhead and speeds up JSON response serialization when Mongoose document features (like methods, virtuals, or save tracking) are not needed.
**Action:** Always append `.lean()` to read-only query chains in API endpoints before passing results to `res.json()` or external serialization.
