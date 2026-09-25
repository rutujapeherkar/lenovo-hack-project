# Phase P07 — Acceptance Criteria: Explain Screen & Vision Assistance

## Acceptance Checklist

- [x] **AC-P07-01:** Navigating to `/explain-screen` renders the file upload area and sensitive credential warning notice.
- [x] **AC-P07-02:** Drag-and-drop and manual file selection accept `image/png`, `image/jpeg`, and `image/webp`.
- [x] **AC-P07-03:** Attempting to upload a non-image file (e.g., PDF or TXT) triggers a clear validation error.
- [x] **AC-P07-04:** Attempting to upload an image exceeding 5 MB displays: *"Image size exceeds 5 MB limit."*
- [x] **AC-P07-05:** Selecting a valid image displays a thumbnail preview and an "Explain Screen" action button.
- [x] **AC-P07-06:** Clicking "Explain Screen" triggers loading state: *"Explaining this screen..."*.
- [x] **AC-P07-07:** Returned explanation renders a high-level summary, detected fields, and action buttons.
- [x] **AC-P07-08:** "What should I do next?" section gives clear, actionable instructions.
- [x] **AC-P07-09:** Glossary section defines confusing civic terms identified on screen.
- [x] **AC-P07-10:** Uploaded images are held in memory only and never saved permanently to disk or cloud storage.
