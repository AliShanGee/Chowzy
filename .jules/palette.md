# Palette Journal

## 2026-07-27 - Converting Non-Semantic Interactive Elements to Buttons
**Learning:** Hardcoded interactive `div` containers lack natural accessibility attributes like keyboard focus, screen reader role descriptions, and toggle states. Wrapping custom animations (like Lottie/framer-motion controls) in a standard `<button>` element with custom CSS resets (removing border and padding) ensures seamless visual integration while automatically providing standard keyboard tab indexing.
**Action:** Always refactor custom animated toggles and interactive container divs to use semantic `<button>` tags with `aria-label` and `aria-pressed` states.
