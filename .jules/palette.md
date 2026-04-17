## 2025-05-14 - Accessible Toggles and Keyboard Focus
**Learning:** Replacing non-semantic `div` toggles with `button` elements is only half the battle for accessibility. Without explicit `:focus-visible` styles, keyboard users often lose track of their "cursor" on the page, especially when standard browser outlines are suppressed or inconsistent with the theme.
**Action:** When refactoring interactive elements for accessibility, always ensure high-contrast `:focus-visible` states are implemented. Use existing design system utilities like Bootstrap's `.focus-ring` classes to maintain consistency and avoid custom CSS bloat.

## 2025-05-14 - Persona Boundaries and CI Fixes
**Learning:** While fixing CI failures is critical, it must be done without violating persona boundaries. Adding new dependencies to fix a build error might be seen as over-reaching if those dependencies aren't directly related to the task (e.g., UX). However, removing problematic native dependencies (like `bcrypt`) that cause CI failures is a necessary maintenance task that should be performed in both the root and sub-packages (like `api/`).
**Action:** Prioritize resolving CI blockers using the most surgical approach possible. In full-stack repos, ensure dependency cleanups are applied to all relevant `package.json` files to avoid residual build artifacts.
