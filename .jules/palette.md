## 2025-05-14 - Non-semantic interactive elements
**Learning:** Using `div` or `span` for interactive elements like toggles or buttons prevents keyboard accessibility and screen reader support. Native `button` elements provide these features out-of-the-box.
**Action:** Always prefer semantic `button` elements for interactive components. Use Bootstrap 5's `.focus-ring` utility to provide clear visual feedback for keyboard users while maintaining visual parity with transparent backgrounds and zero borders.
