# Palette's Journal

## 2024-11-20 - Empty Cart UX Polish
**Learning:** Hardcoded utility classes for color (e.g., `text-white`) create accessibility failures in dual-theme applications; use theme-aware logic (e.g., `theme === 'dark' ? 'text-white' : 'text-dark'`) to maintain legibility in light mode.
**Action:** Always use dynamic color classes based on the active theme or standard Bootstrap/CSS utilities that automatically adjust to the active theme context.
