## 2025-05-20 - Empty State High Contrast Theme Boundaries
**Learning:** Hardcoding CSS variable fallbacks like `var(--text-color, white)` on empty state cards results in invisible white text on white card backgrounds when the application defaults to light mode.
**Action:** Always consume `useTheme()` to explicitly assign high-contrast text (`#212529` / `#ffffff`) and background styles for both light and dark themes when building empty state containers.
