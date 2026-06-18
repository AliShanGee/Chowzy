## 2025-05-14 - [A11y] Semantic Button for Theme Toggle
**Learning:** Using a `div` for interactive elements like theme toggles prevents keyboard navigation and screen reader recognition. Semantic `<button>` elements with `aria-label` provide built-in focusability and accessibility.
**Action:** Always prefer `<button type="button">` over `div` for clickable icons. Use Bootstrap's `btn p-0 border-0 shadow-none` to maintain custom styles without losing default accessibility features.
