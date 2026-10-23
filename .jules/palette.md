## 2025-05-18 - Semantic Button Refactoring & Focus Outlines
**Learning:** Refactoring clickable `<div>` elements to semantic `<button type="button">` tags provides automatic keyboard trigger handling, but setting `outline: 'none'` strips default keyboard focus indicators unless replaced with custom focus rings.
**Action:** When converting custom icon or animation containers to `<button>`, retain native focus outlines or style custom focus rings while wrapping interactive animation sub-trees in `aria-hidden="true"` spans with `pointerEvents: 'none'`.
