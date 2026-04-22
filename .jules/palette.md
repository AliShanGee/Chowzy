## 2025-05-22 - [Keyboard Accessibility for Toggles]
**Learning:** Interactive toggles (like theme switchers or chatbot triggers) implemented as `div` or `span` elements are inaccessible to keyboard and screen reader users. Using semantic `button` elements with `aria-label` and Bootstrap focus utilities (`.focus-ring`) provides native accessibility while maintaining visual parity.
**Action:** Always prefer semantic `<button>` for interactive elements that are not links, and use `aria-label` for icon-only buttons.
