## 2025-05-14 - [Lottie Accessibility]
**Learning:** Animated Lottie components used as toggles are often implemented as divs, which breaks keyboard navigation and screen reader support.
**Action:** Always wrap interactive Lottie animations in semantic <button> elements with appropriate ARIA labels and focus states.
