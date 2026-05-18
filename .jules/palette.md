## 2026-05-18 - Accessible Navigation Toggles
**Learning:** Interactive elements implemented as `div` or `span` lack native keyboard focus and semantic meaning for screen readers. Using `<button type="button">` combined with dynamic `aria-label`, `aria-expanded`, or `aria-pressed` ensures that stateful toggles (like Theme and Chatbot) are both functional and perceivable by all users.
**Action:** Always prefer semantic HTML tags over `div` for interactive controls and use ARIA attributes to describe dynamic states.
