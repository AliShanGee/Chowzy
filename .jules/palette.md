## 2025-06-03 - [ThemeToggle Accessibility]
**Learning:** Interactive elements implemented with `div` tags lack native keyboard support and screen reader recognition. Converting them to semantic `button` elements with `type="button"` and `aria-label` provides immediate accessibility wins.
**Action:** Always check for non-semantic wrappers (`div`, `span`) with `onClick` handlers and replace them with `<button type="button">`.
