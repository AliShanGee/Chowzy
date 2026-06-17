## 2025-05-15 - Semantic Button Refactoring
**Learning:** Refactoring non-semantic interactive elements (like `div` toggles) to semantic `<button>` elements immediately improves accessibility for screen readers and keyboard users. Using Bootstrap's `.focus-ring` provides a consistent focus indicator without custom CSS.
**Action:** Always check for `onClick` handlers on non-interactive elements and refactor them to `<button>` or `<a>` as appropriate.
