## 2026-04-14 - Semantic buttons for interactive toggles
**Learning:** Using `div` or `span` with `onClick` for interactive elements like theme or chatbot toggles prevents keyboard navigation and screen reader discovery. Replacing them with semantic `button` elements (with `background: transparent` and `border: none` to maintain visual parity) ensures native accessibility support.
**Action:** Always use `<button>` for interactive elements that aren't links, and ensure they have descriptive `aria-label` attributes.
