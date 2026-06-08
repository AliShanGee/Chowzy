## 2026-06-08 - Semantic Buttons for Accessibility
**Learning:** Interactive elements should always use semantic HTML like <button> to ensure native keyboard support (Enter/Space) and proper role identification for screen readers. Using <div> with onClick requires manual tabIndex and key listener implementations, which are often overlooked.
**Action:** Always prefer <button type='button'> for clickable icons/elements and reset default browser styles (border, background, padding) to maintain the UI design while gaining full accessibility.
