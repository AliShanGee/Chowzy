## 2025-05-15 - Accessibility for Interactive Lottie Elements

**Learning:** Interactive elements implemented solely with `<div>` and `onClick` are inaccessible to keyboard users and screen readers. Even when using delightful animations like Lottie, they must be wrapped in semantic HTML like `<button type="button">`.

**Action:** Always use semantic `<button type="button">` for interactive controls. Ensure they have descriptive `aria-label` attributes and visible focus indicators (e.g., Bootstrap's `focus-ring`) to maintain accessibility without compromising on micro-interactions.
