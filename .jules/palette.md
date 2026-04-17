## 2025-05-14 - Accessible Toggles and Keyboard Focus
**Learning:** Replacing non-semantic `div` toggles with `button` elements is only half the battle for accessibility. Without explicit `:focus-visible` styles, keyboard users often lose track of their "cursor" on the page, especially when standard browser outlines are suppressed or inconsistent with the theme.
**Action:** When refactoring interactive elements for accessibility, always ensure high-contrast `:focus-visible` states are implemented globally or per-component to guarantee discoverability for keyboard-only users.
