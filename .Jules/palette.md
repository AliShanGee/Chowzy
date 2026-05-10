# Palette's Journal

## 2025-05-15 - [Accessible Authentication Toggles]
**Learning:** Icon-only buttons (like password visibility toggles and geolocation triggers) are common in Bootstrap-based authentication forms but are invisible to screen readers without explicit ARIA labels. Using dynamic labels that reflect the current state (e.g., "Show" vs "Hide") is crucial for accessible interaction.
**Action:** Always implement dynamic `aria-label` attributes for state-toggling buttons and descriptive labels for functional icon buttons. Ensure loading indicators within buttons are hidden from screen readers using `aria-hidden="true"`.
