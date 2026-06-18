## 2025-05-22 - Semantic Buttons for Interactive Animations
**Learning:** High-fidelity animations (like Lottie) wrapped in non-interactive elements (like `div`) are invisible to assistive technologies and keyboard users. Refactoring these to semantic `<button type="button">` tags provides native focusability and allows for descriptive `aria-label` and `aria-expanded` attributes.
**Action:** Always wrap interactive Lottie animations or icon-only triggers in semantic `<button>` elements with clear ARIA labels.
