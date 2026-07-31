## 2025-02-21 - Native Focus Outlines in Interactive Refactorings
**Learning:** When refactoring non-semantic interactive components (like `div` toggles) to semantic `<button>` elements for accessibility, suppressing focus indicators via `outline: 'none'` (without defined focus styles) breaks accessibility for keyboard-only users by leaving them unable to track active focus.
**Action:** Ensure native focus outlines are kept intact or explicitly styled using standard accessible focus utility classes rather than blindly applying standard resets.
