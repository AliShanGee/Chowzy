## 2025-05-14 - Semantic Theme Toggle
**Learning:** Interactive elements implemented as `div` tags lack native keyboard focus and ARIA roles, making them invisible to screen readers and keyboard-only users. Using a semantic `button` with Bootstrap focus-ring classes provides an accessible and consistent experience without requiring custom CSS.
**Action:** Always prefer `<button>` for click actions and include dynamic `aria-label` for state-dependent toggles.
