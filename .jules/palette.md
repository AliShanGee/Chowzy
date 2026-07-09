## 2026-07-09 - Improving Accessibility and Delight in Cart and Navbar

**Learning:** Non-semantic elements (div/span) used for interactions lack default focusability and ARIA roles; always use semantic `<button type="button">` with `aria-label` and reset styles (`border: none`, `background: none`, `padding: 0`) to ensure an inclusive experience without breaking the design. Rich empty states with Lottie animations and clear CTAs significantly improve the "dead-end" feel of an empty cart.

**Action:** When refactoring interactive elements, immediately use `<button>` with an ARIA label and ensure the cart's empty state always provides a way back to the main shopping flow.
