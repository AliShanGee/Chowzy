# Palette's Journal - Chowzy UX/Accessibility Learnings

## 2025-05-15 - Enhancing Empty States and Accessibility

**Learning:** Empty states are often overlooked but represent a prime opportunity to guide users back into the core loop. Using Lottie animations makes the experience more delightful, and adding a clear CTA (Call to Action) reduces friction. For accessibility, non-semantic close buttons (like '✕') and icon-only buttons (like delete) MUST have descriptive `aria-label` attributes to be usable by screen readers.

**Action:** Always check for empty states in tables/lists and ensure interactive icons have proper ARIA labels and focus indicators.
