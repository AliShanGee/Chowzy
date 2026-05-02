## 2025-05-15 - React Hook Placement in Render Loops
**Learning:** React hooks like `useMemo` cannot be called inside callbacks or IIFEs used within the JSX return block. Doing so violates the rules of hooks and causes build errors.
**Action:** Always lift memoization logic (`useMemo`, `useCallback`) to the top level of the functional component, even if the result is only used within a specific conditional rendering block or IIFE.
