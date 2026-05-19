## 2025-05-22 - [Global Navigation Accessibility & Polish]
**Learning:** High-fidelity animations (Lottie, GSAP) can often mask accessibility gaps where interactive elements are implemented as non-semantic `div`s. These elements are invisible to keyboard and screen reader users.
**Action:** Always refactor interactive triggers to semantic `<button type="button">` tags and provide descriptive `aria-label`s for icon-only/animation-only components.
