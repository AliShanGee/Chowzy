## 2025-05-18 - Generic Span ARIA Label Fallback
**Learning:** Adding `aria-label` to generic HTML container elements like `<span>` or `<div>` without an explicit role causes screen readers to ignore the `aria-label` attribute and fail to announce the label.
**Action:** Always include `role="img"` (or another explicit ARIA role) when applying `aria-label` to a generic `<span>` or `<div>` wrapper around decorative/animated text.
