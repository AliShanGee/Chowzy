## 2025-08-21 - Clean up GSAP event listeners on location changes
**Learning:** Attaching DOM event listeners inside `useEffect` or `useLayoutEffect` that depend on `location` will repeatedly attach duplicate handlers on every route change if a cleanup function is not provided, resulting in event handler memory leaks and stacked animation callbacks.
**Action:** Always return an explicit cleanup function from `useEffect` to call `removeEventListener` for each attached handler when listening to route or state changes.
