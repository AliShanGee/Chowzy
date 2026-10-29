## 2025-05-18 - Optimistic Updates & Mongoose `.lean()` String Comparison
**Learning:** When using Mongoose `.lean()`, MongoDB document `_id` fields are returned as `ObjectId` instances rather than strings. Calling `Array.prototype.includes(stringUserId)` or `id.toString() === userId.toString()` directly on plain objects can fail or throw `TypeError` if `userId` is missing or undefined.
**Action:** Always validate `userId` existence, cast `userId` to string explicitly (`String(userId)`), and compare using `id && id.toString() === stringUserId`.
