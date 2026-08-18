## 2025-05-18 - SearchBar Highlight Substring Matching
**Learning:** Constructing dynamic `RegExp` objects (`new RegExp(query, 'gi')`) during UI rendering causes computational overhead and leads to `SyntaxError` crashes when users input regex-special characters like `(`, `[`, `?`, or `*`.
**Action:** Use linear string scanning with `indexOf` and `.slice()` for highlighted substring rendering in autocomplete components.
