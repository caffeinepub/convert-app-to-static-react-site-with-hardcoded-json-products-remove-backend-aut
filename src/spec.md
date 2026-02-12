# Specification

## Summary
**Goal:** Let users download the app’s current plain-text UI translations file directly from the UI, and document how to do it.

**Planned changes:**
- Add a user-accessible UI control that triggers a browser download of the current UI translations as a `.txt` file in the existing `KEY = English | Spanish` format.
- Ensure the downloaded file content matches `frontend/src/texts/ui-texts.txt` exactly (including comments and section headers) and works in production builds.
- Update `frontend/src/UI_TEXT_PLAIN_TEXT_WORKFLOW.md` with step-by-step instructions for downloading the file from the UI, and document the mapping to `frontend/src/texts/ui-texts.txt` plus the expected downloaded filename.

**User-visible outcome:** A user can click an in-app download option to get a `.txt` translations file that matches the app’s current UI text source, and can follow documentation to locate and understand the source file in the repository.
