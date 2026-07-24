# Palette Journal - UX & Accessibility

## 2025-03-05 - Semantic Button Elements and Theme Toggles
**Learning:** Interactive components such as custom icon-only toggle buttons (like ThemeToggle) and modal controls must use semantic `<button>` elements with `type="button"` and clear `aria-label` or `aria-pressed` descriptions to be accessible by screen readers and properly navigable via keyboard. Using custom interactive `div` elements violates basic accessibility requirements.
**Action:** Replace interactive `div` containers with `<button>` elements, reset default button styles, and ensure robust focus-ring support for keyboard navigation.
