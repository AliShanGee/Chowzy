## 2026-05-29 - Debounce Cart Backend Synchronization

**Learning:** Rapid client-side state actions (such as adding/removing cart items or adjusting quantities) dispatch immediate asynchronous HTTP POST requests to `/api/updatecart`, creating redundant network traffic and unnecessary backend write operations.
**Action:** Debounce backend synchronization calls (e.g. 300ms) while keeping client-side state and `localStorage` persistence synchronous to ensure instant UI responsiveness and reduce API overhead.
