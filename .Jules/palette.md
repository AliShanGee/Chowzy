## 2025-05-18 - Preserving Native Heading Semantics on Animated Headers
**Learning:** Overriding `<h2>` or other heading elements with `role="img"` to group animated letters into a single accessible name strips the implicit heading role from the DOM, breaking screen reader heading outline navigation (e.g., navigating via heading shortcuts like `H` or `2`).
**Action:** Retain native heading elements, apply `aria-label` directly on the `<h1-6>` tag, and set `aria-hidden="true"` on the nested decorative or character-by-character animated `<span>` elements.
