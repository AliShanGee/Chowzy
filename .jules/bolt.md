## 2025-05-15 - Optimized Home Screen Rendering Loop

**Learning:** The `Home.js` component was using a nested `.filter()` and `.reduce()` (with `.some()`) inside a `.map()` of categories, leading to $O(C \cdot N^2)$ complexity. This caused noticeable UI lag even with moderate datasets as the main thread was blocked during filtering and deduplication on every render (e.g., on every keystroke in the search bar).

**Action:** Replace nested loops with a single $O(N)$ pre-processing pass using `useMemo` and `Map` to group and deduplicate items by category. Additionally, use `React.memo` on list items (Card) to skip re-renders when their specific data hasn't changed during parent state updates.
