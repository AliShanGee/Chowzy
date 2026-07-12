## 2025-05-14 - [Enhanced Empty Cart Experience]
**Learning:** A plain text "Cart is Empty" message is a missed opportunity for engagement. Adding a Lottie animation and a clear CTA ("Browse Foods") significantly improves the user flow and reduces bounce rates from the cart page.
**Action:** Always provide a visual indicator and a clear way back to the main content when encountering empty states.

## 2025-05-14 - [Theme-Aware Accessibility]
**Learning:** Hardcoded text classes (like `text-white`) in components can lead to invisibility in light mode when the background also turns white.
**Action:** Use theme-aware conditional classes or CSS variables to ensure text remains legible across all theme transitions. Added ARIA labels to all icon-only buttons to ensure screen reader compatibility.
