## 2024-06-22 - [Accessibility: Refactoring Interactive Divs to Buttons]
**Learning:** In this codebase, several interactive elements (Theme Toggle, Chatbot Toggle) were implemented using `div` elements with `onClick` handlers. This prevents keyboard navigation (no tab focus) and fails to convey the element's role to screen readers. Refactoring these to semantic `<button type="button">` with descriptive `aria-label` and Bootstrap's `.focus-ring` utility provides a native, accessible experience without breaking existing layouts.
**Action:** Always scan for `onClick` on non-semantic tags and convert to `<button type="button">` while resetting default button styles (border, padding, background) to maintain visual consistency.

## 2024-06-22 - [Style Consistency: Inline Background Styles]
**Learning:** When resetting button backgrounds in inline React styles, using `backgroundColor: 'transparent'` is more consistent with other property names (like `borderRadius`) than the shorthand `background: 'transparent'`.
**Action:** Prefer `backgroundColor` for transparency resets in interactive components to ensure style property consistency.
