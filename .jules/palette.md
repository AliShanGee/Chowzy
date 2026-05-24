## 2025-05-14 - Semantic Interactive Elements
**Learning:** This application frequently uses non-interactive `div` elements for clickable UI components (Chatbot toggle, Theme toggle), which prevents keyboard focus and screen reader discovery.
**Action:** Always refactor clickable `div`s to semantic `<button type="button">` elements with Bootstrap's `focus-ring` utility to ensure accessibility and consistent focus states.
