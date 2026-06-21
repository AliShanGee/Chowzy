## 2025-01-24 - [Card Component Accessibility]
**Learning:** Interactive elements for toggling content (like "show more") should always be semantic <button> elements with appropriate ARIA attributes (aria-expanded, aria-label) rather than non-semantic <span> tags to ensure keyboard and screen reader accessibility. Additionally, focus indicators should never be suppressed (e.g., via outline: none) without a suitable replacement like Bootstrap's .focus-ring.

**Action:** Always check for non-semantic interactive spans/divs and ensure focus visibility is maintained on form controls.
