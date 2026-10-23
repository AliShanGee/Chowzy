## 2025-05-18 - Optimized Search Highlight and Filter Operations
**Learning:** Using `new RegExp` inside render functions / item loops like search dropdown highlighting causes high object allocation overhead and fatal `SyntaxError` crashes when user input contains unescaped regex special characters (e.g. `(`, `[`, `?`).
**Action:** Replace `new RegExp` string splitting in autocomplete components with linear `indexOf` substring slicing to improve performance (~2.5x-10x faster) and ensure robustness against special characters.
