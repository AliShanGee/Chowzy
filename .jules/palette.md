## 2026-10-10 - Accessible Lottie Button Enclosure
**Learning:** Lottie SVG/canvas animations inside interactive controls intercept pointer and focus events if not wrapped in `pointer-events: none` elements with `aria-hidden="true"`.
**Action:** Always wrap nested Lottie animations inside a `<span>` with `pointerEvents: 'none'`, `aria-hidden="true"`, and `display: 'block'` when placing them inside semantic `<button>` elements.
