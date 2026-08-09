# Palette's Journal - Critical Learnings Only

## 2025-02-18 - Keyboard Accessibility for Custom Interactive Elements
**Learning:** Using `motion.div` as buttons makes them visually appealing but completely invisible and unusable for keyboard-only and screen reader users. They must always have standard ARIA roles, be focusable, and support keyboard events.
**Action:** Ensure all interactive custom divs are refactored or enhanced with `role="button"`, `tabIndex={0}`, `aria-label`, and `onKeyDown` event handling.

## 2025-02-18 - Preventing UX Dead-ends with Clear CTAs
**Learning:** Empty states (like an empty shopping cart) without navigation choices leave users stuck and increase drop-off rates.
**Action:** Always provide an empty state with an engaging graphic/emoji, supportive descriptive text, and a prominent call-to-action (CTA) button to guide users back to the main user flow.
