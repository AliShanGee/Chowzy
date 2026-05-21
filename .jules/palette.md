## 2025-05-14 - [Accessibility & Feedback]
**Learning:** Interactive elements implemented as <div> tags are inaccessible to keyboard users. Using semantic <button type="button"> with aria-label and aria-expanded is the standard pattern for toggles (Chatbot, Theme). Immediate visual feedback via notifications (Store.addNotification) significantly improves the perceived responsiveness of "Add to Cart" actions.
**Action:** Always refactor non-semantic interactive <div>s to <button>s and ensure async or state-changing actions provide clear UI feedback.
