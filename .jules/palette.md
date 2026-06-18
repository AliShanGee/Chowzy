## 2025-05-23 - Semantic Toggles for Accessibility
**Learning:** Using non-semantic elements like `div` for interactive toggles prevents keyboard accessibility and screen reader recognition. Semantic `button` elements provide these features by default.
**Action:** Always use `<button type="button">` for toggles and icon-only interactive elements, ensuring they have `aria-label` and visible focus indicators (`focus-ring`).
