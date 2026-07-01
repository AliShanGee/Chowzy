## 2025-05-15 - Interactive Toggles using Non-Semantic Elements
**Learning:** Found a pattern where interactive components (ThemeToggle, Chatbot toggle) were implemented using `div` elements wrapping Lottie animations. This completely breaks keyboard navigation (tab order) and provides no feedback to screen readers.
**Action:** Always wrap interactive icon/animation components in a semantic `<button type="button">` with a descriptive `aria-label` and focus indicator (e.g., Bootstrap's `.focus-ring`).
