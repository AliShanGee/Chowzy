## 2025-05-18 - Screen Reader Accessibility for Character-Split SVG Logo Animations
**Learning:** Returning array-mapped character spans with SVG overlays without a semantic root wrapper causes screen readers to pronounce each letter individually ("C h o w z y").
**Action:** Wrap character-mapped text animations in a parent `<span role="img" aria-label={text}>` container and set `aria-hidden="true"` on inner character `<span>`s.
