# Specification

## Summary
**Goal:** Make it clear for developers where the admin routes are defined and what the admin paths are.

**Planned changes:**
- Update `frontend/src/ADMIN_ROUTES.md` to explicitly state that admin routes are defined in `frontend/src/App.tsx` and list the paths `/admin/login` and `/admin`.
- Add a short comment in `frontend/src/App.tsx` near the `/admin/login` and `/admin` route definitions pointing maintainers to `frontend/src/ADMIN_ROUTES.md`.

**User-visible outcome:** Developers can quickly find and verify the admin route definitions and paths without changing any app behavior.
