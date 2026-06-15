## 2025-05-15 - Refactoring interactive spans to semantic buttons
**Learning:** Using `span` for interactive elements like "Show more/less" breaks keyboard accessibility and screen reader expectations. Semantic `<button type="button">` elements provide native keyboard support (Enter/Space) and focusability, which can be styled to match the original design with CSS resets (background: transparent, border: none, padding: 0).
**Action:** Always prefer semantic `<button>` over `span` or `div` for clickable actions, and use `aria-expanded` to communicate state changes to screen readers.
