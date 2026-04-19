## 2025-05-14 - Improve keyboard accessibility for Navbar toggles
**Learning:** Using `div` or `span` for interactive elements like theme toggles or chatbot buttons breaks keyboard navigation and screen reader support. Semantic `button` elements should always be used to ensure they are focusable and can be activated with Enter/Space out of the box.
**Action:** Replace `div` or `span` onClick handlers with semantic `button` elements. Use Bootstrap's `.focus-ring` utility to provide high-contrast focus indicators while maintaining the design aesthetics.
