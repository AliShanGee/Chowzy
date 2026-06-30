## 2025-05-14 - Semantic Button Refactoring for Theme Toggles
**Learning:** Icon-only toggles implemented as `div` elements are invisible to keyboard navigation and screen readers.
**Action:** Use `<button type="button">` with `aria-label` and Bootstrap's `.focus-ring` to ensure interactive elements are accessible and provide clear visual focus indicators.
