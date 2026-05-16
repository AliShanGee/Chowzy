## 2025-02-28 - Semantic Toggles for Accessibility
**Learning:** Using non-interactive elements like `div` for UI toggles (e.g., Chatbot triggers) prevents keyboard focus and fails to communicate state to screen readers. Semantic `<button>` elements provide native keyboard support and work with ARIA attributes to describe purpose and state.
**Action:** Always refactor interactive `div` or `span` elements to `<button type="button">` when they trigger a UI state change, ensuring `aria-label` and `aria-expanded` are used to maintain accessibility.
