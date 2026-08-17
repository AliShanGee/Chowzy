## 2025-05-18 - Memoize GSAP Carousel and Clean Up Timelines
**Learning:** Initializing GSAP plugins inside component bodies re-registers plugins on every render, and infinite GSAP timelines without unmount cleanup cause memory leaks and stray background process execution.
**Action:** Always call `gsap.registerPlugin` at module level, clean up timelines using `tl.kill()` in `useEffect` unmount, and wrap static/animated hero components with `React.memo`.
