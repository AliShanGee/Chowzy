## 2025-05-14 - Interactive Element Accessibility
**Learning:** Using `div` or `span` for interactive elements without a keyboard fallback makes the UI inaccessible to screen reader and keyboard-only users.
**Action:** Always use semantic `<button type="button">` or `<a>` with `aria-label` for icons/animations to ensure they are focusable and properly described.
