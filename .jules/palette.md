# Palette's Journal - Critical Learnings Only

## 2025-03-05 - Semantic Accessible Toggles
**Learning:** Refactoring interactive, non-semantic visual indicators (like custom theme toggles built with `div`) to semantic, keyboard-navigable `<button type="button">` wrappers with dynamic, state-dependent `aria-label` tags dramatically increases accessibility for screen readers and keyboard users. Additionally, specifying explicit style overrides such as `border: 'none'`, `background: 'none'`, and `padding: 0` is required to preserve the original visual styling while ensuring the focus indicator remains natively visible.
**Action:** When working on interactive visual controls, always start with a semantic interactive element (like `<button>`) or wrap existing non-semantic custom structures inside them with explicit accessibility-focused styling instead of custom CSS/div controls.
