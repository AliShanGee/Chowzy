# Palette's Journal - UX & Accessibility Learnings

## 2025-05-15 - [Engaging Empty States & ARIA Labels]
**Learning:** Generic "Empty" messages (like "The Cart is Empty!") are functional but uninspiring. Combining a relevant Lottie animation with a clear Call-to-Action (CTA) button significantly improves the user experience by providing visual feedback and a path forward. Additionally, dynamic `aria-label` attributes on repetitive action buttons (like 'Remove from cart') are essential for screen reader users to distinguish between multiple items.
**Action:** Always look for opportunities to replace static empty-state text with visual assets and navigation triggers. Ensure that any item-specific action button in a list or table includes the item name in its `aria-label`.
