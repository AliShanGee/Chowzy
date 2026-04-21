## 2025-05-14 - Replace non-semantic toggles with buttons
**Learning:** Using `div` or `span` with `onClick` for interactive elements like theme toggles or chatbot launchers breaks keyboard accessibility. Screen readers don't recognize them as buttons, and they aren't naturally focusable via Tab.
**Action:** Always use semantic `<button>` elements for toggles. Apply Bootstrap's `.focus-ring` or similar utilities to provide visual focus indicators while maintaining visual parity with the original design.
