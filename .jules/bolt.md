## 2025-02-22 - JSDOM SVG getBBox Mock for @smastrom/react-rating
**Learning:** React components using `@smastrom/react-rating` trigger JSDOM `SVGElement.prototype.getBBox is not a function` during Jest tests.
**Action:** When testing components with `@smastrom/react-rating`, mock `@smastrom/react-rating/style.css` and assign a fallback `window.SVGElement.prototype.getBBox` method in the test file.
