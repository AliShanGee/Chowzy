## 2026-05-29 - React Card Component Render Optimization
**Learning:** In interactive lists where parent components update state frequently (such as search keystrokes in `Home.js`), child components using complex hooks (like Framer Motion's `useSpring` and `useTransform` in `Card.js`) re-allocate static configuration objects (`springConfig`) and re-evaluate expensive hooks on every render pass.
**Action:** Extract static config objects to module scope and wrap multi-instance card components in `React.memo` to prevent unnecessary re-renders during parent keystrokes and state updates.
