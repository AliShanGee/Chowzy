## 2026-07-06 - Enhanced Empty Cart State and Accessibility

**Learning:** Users often feel "lost" when reaching a terminal empty state (like an empty cart) without a clear next action. Providing a direct "Call to Action" (CTA) button to return to the shopping flow improves retention and reduces friction. Additionally, icon-only buttons (like '✕' or trash cans) are inaccessible to screen readers unless they have descriptive `aria-label` attributes.

**Action:** Always provide a helpful CTA in empty states. Ensure every interactive icon-only element has a descriptive `aria-label` that explains its purpose (e.g., "Remove item" instead of just "Button").
