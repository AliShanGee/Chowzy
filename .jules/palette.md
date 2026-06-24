## 2026-06-24 - Semantic Buttons for Accessibility

**Learning:** Using non-semantic `div` elements for interactive toggles prevents keyboard navigation and lacks screen reader context. Refactoring these to `<button type="button">` with `aria-label` and `.focus-ring` significantly improves accessibility without changing the visual design.

**Action:** Always prefer `<button type="button">` for interactive elements that are not links, ensuring they have descriptive labels and focus states.
