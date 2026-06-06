## 2025-05-14 - Semantic Buttons for Interactive Elements
**Learning:** Interactive elements like payment method selectors or custom navigation toggles implemented with `div` or `motion.div` are not keyboard-accessible by default. This prevents users who rely on keyboards or screen readers from interacting with core features like checkout. Using semantic `<button>` or `<motion.button>` elements automatically provides keyboard focus and interaction support (Enter/Space keys).

**Action:** Always use semantic `<button type="button">` or `<motion.button>` for interactive elements. If a group of options represents a single choice, implement the `radiogroup` ARIA pattern with `role="radio"` and `aria-checked` to ensure proper screen reader announcements.
