## 2025-05-14 - [Accessibility Pattern: Interactive Toggles]
**Learning:** Several interactive toggles in the navbar were identified as non-semantic `div` elements. Refactoring these to semantic `<button type="button">` with `aria-label` and Bootstrap's `.focus-ring` utility significantly improves keyboard and screen reader accessibility.
**Action:** Always check if clickable `div` or `span` elements should be semantic `<button>` elements and ensure they have descriptive `aria-label` and focus indicators.
