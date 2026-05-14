## 2025-05-15 - [Initial Assessment]
**Learning:** Interactive elements implemented as `div` tags lack keyboard focus and semantic meaning for screen readers. Using Bootstrap's `btn` classes with `border-0 p-0` allows for semantic `<button>` elements that maintain the original visual design.
**Action:** Always prefer `<button type="button">` over `div` for click-based interactions.
