# Palette's Journal - UX & Accessibility Learnings

## 2025-05-14 - Initial Setup
**Learning:** Found that the app uses many non-semantic elements (divs) for interactive components like toggles and icon buttons, which hinders keyboard accessibility and screen reader support.
**Action:** Always refactor interactive divs to semantic `<button type="button">` and add descriptive `aria-label`s.

## 2025-05-14 - Empty Cart Micro-UX
**Learning:** A plain text "The Cart is Empty!" message is a missed opportunity for delight and guidance.
**Action:** Replace empty states with engaging Lottie animations and a clear Call-to-Action (CTA) to guide users back to the main flow.
