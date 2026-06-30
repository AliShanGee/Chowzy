## 2025-05-14 - Accessibility Refactoring of Interactive Elements
**Learning:** In many React components, interactive elements like toggles and expansion links were implemented using non-semantic `div` or `span` tags. These elements are not reachable via keyboard navigation and lack the necessary ARIA attributes for screen readers.
**Action:** Always refactor non-semantic interactive elements to semantic `<button type="button">` elements. Add descriptive `aria-label` attributes and use Bootstrap's `.focus-ring` utility to ensure consistent and accessible focus indicators.
