## 2025-05-14 - [Semantic Buttons for Icon Toggles]
**Learning:** Using `div` or `span` for interactive elements like theme toggles or chatbot triggers prevents keyboard navigation and lacks screen reader context. Converting them to `button` with `.focus-ring` provides an accessible, keyboard-friendly experience without changing the visual design.
**Action:** Always check if a clickable element is a semantic `button` and has an `aria-label` if it only contains an icon or animation.
