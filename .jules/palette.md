## 2026-04-15 - Semantic Toggles for Accessibility
**Learning:** Using 'div' tags for interactive toggles breaks screen reader support and keyboard navigation. Semantic 'button' elements provide native accessibility, role identification, and keyboard interaction (Enter/Space) by default.
**Action:** Always replace non-semantic interactive wrappers with 'button' elements, ensuring they have 'type="button"', a descriptive 'aria-label', and preserved focus indicators.
