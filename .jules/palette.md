## 2026-06-07 - [Keyboard Accessibility for Interactive Lottie Components]
**Learning:** Replacing non-semantic `div` wrappers with `<button type="button">` is essential for keyboard focus and screen reader support in custom interactive elements (like Lottie animations). Adding `focus-visible` styles ensures a clear visual indicator for keyboard users without affecting mouse users.
**Action:** Always use semantic HTML buttons for interactive components and provide explicit `aria-label` attributes when the content is purely visual or uses animations.
