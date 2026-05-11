## 2025-05-15 - [Navbar and Auth Form Accessibility]
**Learning:** Interactive toggles (Theme, Chatbot) were implemented as `div` elements, making them inaccessible to keyboard users and screen readers. Converting these to semantic `button` elements with `type="button"` and `aria-label` provides native focus management and clear intent.
**Action:** Always prefer semantic `<button type="button">` over interactive `div` elements and ensure icon-only actions have descriptive `aria-label` attributes.
