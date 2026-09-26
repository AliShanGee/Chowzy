## 2025-05-18 - Semantic Description Expand Controls
**Learning:** Truncated text toggle links (`...` / `(less)`) implemented as `<span>` tags with `onClick` handlers are inaccessible to keyboard users and screen readers because they cannot receive focus or announce expansion state.
**Action:** Replace `onClick` `<span>` expand/collapse toggles with zero-styled `<button type="button">` elements featuring `aria-expanded` and item-specific `aria-label` attributes.
