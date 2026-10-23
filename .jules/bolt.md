## 2025-05-20 - Deterministic Keys in Polling Data Transformers
**Learning:** Using `Math.random()` to generate unique React element keys inside periodic polling functions (e.g. `fetchMyOrder` every 12s) causes React DOM reconciliation to invalidate and unmount/remount entire component subtrees on every poll cycle.
**Action:** Always derive deterministic IDs based on persistent parent record IDs, order dates, or batch indices when transforming array data fetched during polling to maintain stable component identities and avoid DOM thrashing.
