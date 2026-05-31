## 2025-05-15 - Semantic Buttons & Contextual ARIA Labels
**Learning:** Using semantic `<button type="button">` instead of `div` or `span` for interactive elements is non-negotiable for accessibility. Furthermore, repetitive actions in lists (like 'Remove') must include contextual information (e.g., the item name) to be meaningful for screen reader users.
**Action:** Default to `<button type="button">` for all clickable components and ensure `aria-label` includes dynamic context when used in loops.
