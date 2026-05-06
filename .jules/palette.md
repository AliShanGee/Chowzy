## 2025-05-14 - Semantic HTML for Interactive Toggles
**Learning:** Interactive elements implemented as `div` tags lack keyboard focus and don't communicate state to screen readers. Converting them to `button` tags with `aria-label` and `aria-expanded` fixes this, but requires CSS resets (`border: none`, `padding: 0`, `background: transparent`) to maintain visual parity in a Bootstrap-heavy environment.
**Action:** Always prefer `<button>` for non-link interactions and apply minimal resets to match existing designs.
