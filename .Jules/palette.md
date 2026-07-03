## 2024-07-03 - Form Input Accessibility
**Learning:** Forms that rely only on placeholders without explicit `<label>` elements are a common accessibility issue. Screen readers often skip placeholders or read them inconsistently. In addition, when a form submits successfully or with an error, the screen reader needs to be notified.
**Action:** Always add explicit `aria-label` attributes to inputs that lack a linked `<label>`. Ensure status/feedback messages have `role="status"` and `aria-live="polite"` so screen readers read the message when it dynamically appears.
