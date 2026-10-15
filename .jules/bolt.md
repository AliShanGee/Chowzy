## 2025-05-20 - Card Component Re-render Optimization
**Learning:** In list views with animated or interactive cards (such as Framer Motion tilt components), parent state changes (e.g. search query or category pagination) re-render every card on every keystroke. Wrapping cards in `React.memo` and memoizing dynamic option keys prevents unnecessary re-renders of off-screen or unchanged items.
**Action:** Always wrap heavy interactive card components in `React.memo` and memoize nested option transformations to preserve frame rates during fast user typing.
