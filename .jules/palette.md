## 2025-05-14 - [Semantic Buttons for Toggles]
**Learning:** Using 'div' elements with 'onClick' for toggles (like theme or chatbot) makes them inaccessible to keyboard and screen reader users. Refactoring these to semantic 'button' elements with 'aria-label' and reset styles ('background: transparent', 'border: none', 'padding: 0') provides full accessibility without changing the visual design.
**Action:** Always prefer 'button' over 'div' or 'span' for any interactive element that doesn't have a semantic role, and ensure the closing tag matches.

## 2025-05-14 - [Grammatical Pluralization in ARIA Labels]
**Learning:** Dynamic ARIA labels that include counts (like "Cart with 1 items") feel unpolished. Adding simple ternary logic for pluralization (e.g., `item${count === 1 ? '' : 's'}`) adds a micro-touch of delight and professionalism.
**Action:** Implement conditional pluralization in all dynamic UI strings and ARIA labels.
