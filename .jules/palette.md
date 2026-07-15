## 2025-05-14 - [Empty Cart UX & Accessibility]
**Learning:** Hardcoded utility classes for color (e.g., `text-white`) create accessibility failures in dual-theme applications; use theme-aware logic (e.g., `theme === 'dark' ? 'text-white' : 'text-dark'`) to maintain legibility in light mode. Non-semantic elements used as buttons (e.g., `motion.div`) must be refactored to `<button>` or have full ARIA/keyboard support (role, tabIndex, onKeyDown).
**Action:** Always check interactive elements for semantic tags and ensure text contrast remains high across all supported themes.
