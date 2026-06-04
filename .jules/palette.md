## 2025-06-04 - Accessibility Sweep for Core Interactive Elements
**Learning:** Many interactive elements in this codebase (search buttons, cart removal, description expansion) were missing semantic roles or descriptive labels, making them inaccessible to screen readers and keyboard-only users.
**Action:** When working on UX enhancements in this repo, prioritize checking for `aria-label` on icon buttons and `role="button"`/`tabIndex` on clickable `span` or `div` elements. Always ensure `onKeyDown` handlers are added for non-button interactive elements.
