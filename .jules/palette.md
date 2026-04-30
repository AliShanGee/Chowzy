## 2025-05-22 - Improving Keyboard Accessibility for Interactive Toggles

**Learning:** Using `div` or `span` for interactive elements with `onClick` handlers makes them inaccessible to keyboard users and screen readers. Semantic `button` elements should always be used for actions.

**Action:** Convert non-semantic interactive elements to `button` tags with `aria-label` for descriptions and Bootstrap 5 `.focus-ring` for keyboard visibility.
