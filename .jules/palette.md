## 2025-05-14 - Navbar Toggle Accessibility

**Learning:** Several interactive toggles in the navbar (ThemeToggle and Chatbot) were implemented as non-semantic `div` elements with `onClick` handlers. While they looked fine visually, they were not accessible via keyboard and lacked appropriate ARIA roles/labels for screen readers.

**Action:** Refactor non-semantic interactive `div` elements into semantic `<button type="button">` elements. Always include an `aria-label` for icon-only buttons and ensure focus states are visible (e.g., using Bootstrap's `.focus-ring`).
