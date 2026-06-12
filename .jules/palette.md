# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-03-24 - Initializing Journal
**Learning:** Initializing the Palette journal to track critical UX and accessibility improvements in the Chowzy application.
**Action:** Always document significant accessibility patterns and UX enhancements that provide reusable insights for the design system.

## 2025-03-24 - Semantic Buttons for Interactive Elements
**Learning:** Using `span` or `div` elements for interactive triggers (like "Read More" or "Close") excludes keyboard users and doesn't provide state information (like expanded/collapsed) to screen readers.
**Action:** Always refactor non-semantic interactive triggers to `<button type="button">` and include `aria-expanded` attributes for collapsible content. Reset button styles (background: none, border: none, padding: 0) to maintain visual design while ensuring accessibility.
