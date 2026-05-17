## 2025-05-14 - Semantic Interactive Elements in Navbar
**Learning:** This application extensively used `div` elements with `onClick` handlers for primary navigation and utility toggles (Theme, Chatbot). This pattern breaks keyboard accessibility as `div`s are not focusable by default and lack necessary ARIA states.
**Action:** Always refactor interactive `div` elements to semantic `<button type="button">` or `<a>` tags. Ensure utility toggles include `aria-expanded` and `aria-label` to communicate state and purpose to assistive technologies.
