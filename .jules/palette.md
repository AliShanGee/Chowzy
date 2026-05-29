## 2025-05-14 - [Semantic Radio Groups for Custom Selection]
**Learning:** When replacing non-semantic `div` or `span` elements used for selection (like payment methods) with buttons, simply using `<button>` is not enough for complex selection patterns. Adding `role="radiogroup"` to the container and `role="radio"` with `aria-checked` to the buttons provides the correct semantic context for screen readers, informing users that they are making a single selection from a group.

**Action:** Always use `role="radiogroup"` and `role="radio"` with `aria-checked` when implementing custom selection interfaces that don't use native HTML radio inputs.
