## 2026-11-09 - Accessible Interactive Button Resets and Focus Indicators
**Learning:** When refactoring clickable containers (e.g., `<div>` with `onClick`) into semantic `<button type="button">` elements with CSS resets, avoid removing outlines (`outline: 'none'`) without supplying replacement `:focus-visible` styles, as native focus outlines are essential for keyboard navigation (WCAG 2.4.7 Focus Visible).
**Action:** Always maintain default browser focus indicator behavior or specify dedicated focus-visible rings when resetting button styles on icon/lottie controls.
