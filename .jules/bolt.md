## 2025-05-15 - Optimizing Nested Render-Loop Filtering
**Learning:** Performing O(N^2) data processing (nested filtering and deduplication) directly inside the JSX render block causes significant UI lag during frequent updates like search. Memoizing these operations using O(N) Map-based grouping reduces computation time exponentially as data grows.
**Action:** Always pre-process and memoize complex data structures using useMemo before rendering. Use Maps for O(1) deduplication and lookups instead of nested array methods like .some() or .filter().

## 2025-05-15 - State Initialization vs useEffect
**Learning:** Initializing state to a default value and then updating it via useEffect based on props or refs causes an immediate, redundant re-render after the initial mount.
**Action:** Compute the initial state value directly from props or stable data during the useState initialization to eliminate the extra render cycle and ensure the first paint is correct.
