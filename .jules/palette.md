## 2025-05-14 - [A11y: Semantic Toggles in Navbar]
**Learning:** Using non-semantic `div` elements for interactive toggles (Theme, Chatbot) prevents keyboard accessibility and screen reader recognition. Standard Bootstrap buttons with `.focus-ring` provide a consistent focus indicator without relying on custom CSS.
**Action:** Always audit Navbar components for clickable `div` or `span` elements and refactor them to semantic `<button type="button">` with descriptive `aria-label` and focus states.
