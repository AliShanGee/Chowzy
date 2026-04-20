# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-05-14 - Semantic Interactive Elements
**Learning:** Using `div` or `span` for interactive toggles (like theme switchers or chatbot triggers) breaks keyboard accessibility and screen reader support, as they are not focusable by default and lack appropriate roles.
**Action:** Always use semantic `<button>` elements for interactive components. Use Bootstrap's `.focus-ring` utility to provide high-contrast focus indicators without adding custom global CSS.
