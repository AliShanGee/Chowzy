## 2025-05-14 - Accessible Semantic Toggles

**Learning:** Interactive elements implemented as `<div>` tags are inaccessible to keyboard users and screen readers. Converting them to semantic `<button>` elements with `aria-label` and `aria-expanded` attributes immediately improves the UX for assistive technology users without changing the visual design. Using Bootstrap 5's `.focus-ring` utility allows for clean focus indicators that respect the site's aesthetic.

**Action:** Always prefer semantic `<button>` for interactive toggles. Use `btn focus-ring p-0 border-0` classes to maintain visual parity with custom-styled `div` containers while providing standard focus behavior.
