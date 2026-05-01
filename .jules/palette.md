## 2026-05-01 - Semantic Buttons for Interactive Toggles
**Learning:** Interactive elements like theme toggles or chatbot triggers often use `div` elements with `onClick` handlers, making them inaccessible to keyboard users and screen readers. Bootstrap 5's `.focus-ring` utility allows these to be converted to semantic `button` elements without losing the custom design.
**Action:** Always use `<button>` for clickable UI elements. Use Bootstrap classes `btn focus-ring focus-ring-primary p-0 border-0` and `backgroundColor: "transparent"` to maintain visual parity while ensuring accessibility.
