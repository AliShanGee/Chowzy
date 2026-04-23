# Palette's Journal - UX & Accessibility Learnings

## 2025-05-14 - Accessible Toggles
**Learning:** Using `div` or `span` for interactive elements like toggles makes them inaccessible to keyboard users and screen readers. Converting them to semantic `button` elements with ARIA labels and focus indicators is essential.
**Action:** Always use `<button>` for interactive elements and include `aria-label` and focus styles (e.g., Bootstrap `.focus-ring`).
