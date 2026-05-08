## 2025-05-14 - Semantic Button Pattern for Interactive Toggles
**Learning:** Interactive toggles (like theme switchers and chatbot triggers) in this application were consistently implemented using <div> elements. This prevents keyboard focus and lacks native accessibility features like 'aria-expanded'.
**Action:** Always refactor interactive <div> elements to semantic <button type="button"> elements and include appropriate ARIA attributes (aria-label, aria-expanded) while maintaining visual design with 'background: transparent' and 'border: none'.
