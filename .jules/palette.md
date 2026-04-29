## 2025-04-29 - Improving Accessibility of Custom Interactive Toggles
**Learning:** Custom toggles (like theme switchers or chatbot triggers) implemented as `div` elements are inaccessible to keyboard users and screen readers. Converting them to semantic `button` elements and using Bootstrap 5's `.focus-ring` utility provides a standardized way to ensure keyboard accessibility while maintaining visual parity.
**Action:** Always prefer semantic `<button>` for interactive elements and use `.focus-ring` with `.focus-ring-primary` for consistent focus indicators.
