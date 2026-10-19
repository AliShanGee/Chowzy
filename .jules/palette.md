## 2025-05-18 - Semantic Theme Toggle Button Accessibility
**Learning:** Wrapping interactive Lottie animations inside non-semantic `<div>` elements with `onClick` handlers leaves theme toggles invisible and unnavigable for screen reader and keyboard users.
**Action:** Always render interactive controls as `<button type="button">`, supply dynamic descriptive `aria-label` and `title` attributes (e.g. `Switch to light mode`), and wrap decorative nested animations in `aria-hidden="true"` block `<span>` elements.
