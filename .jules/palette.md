## 2025-02-14 - Semantic Navbar Toggles and Accessibility
**Learning:** Refactoring non-semantic `div` or icon-only wrapper elements to semantic `<button>` elements with clear `aria-label` and style resets (`border: 'none'`, `background: 'none'`, `padding: 0`) provides immediate assistive technology recognition and keyboard focus without altering the visual design of the components.
**Action:** Always wrap interactive icon elements or custom animations representing toggles/actions in semantic `<button>` elements with descriptive dynamic/static ARIA attributes.
