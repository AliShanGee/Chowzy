## 2025-05-22 - Semantic Interaction Patterns
**Learning:** Interactive elements implemented as `div` tags lack native keyboard focus, ARIA role inheritance, and standard interaction patterns (like Enter/Space activation), which compromises screen reader usability and keyboard-only navigation.
**Action:** Always use semantic `<button type="button">` for non-link interactive triggers and include explicit `aria-label` or `aria-expanded` attributes to communicate state and purpose to assistive technologies.
