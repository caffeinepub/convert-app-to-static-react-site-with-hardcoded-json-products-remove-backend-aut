# Specification

## Summary
**Goal:** Restore Internet Identity authentication, backend integration, and a fully working admin-only product management experience (including diagnostics) without runtime errors.

**Planned changes:**
- Re-enable Internet Identity (II) as the primary admin authentication flow and ensure admin backend calls use the logged-in identity (no anonymous/placeholder actor).
- Enforce admin route protection: redirect unauthenticated users from `/admin` to `/admin/login`, and ensure logout clears the II session and cached admin data.
- Restore Admin Panel functionality so all existing modules load and operate correctly (Dashboard and managers for Products, Packages, How to Order, Instagram, Sections, Content Blocks) with working React Query data fetching and mutations.
- Add an in-app admin bootstrap flow to register the logged-in Principal (associated by the user with `hernan@zerma-la.com`) as the first/desired admin, persist admin authorization in the backend, and prevent self-promotion by non-admins.
- Make product CRUD fully operational end-to-end (list/create/update/delete, optional image retention on edit) and strictly enforce admin-only mutations at the backend boundary.
- Add an Admin “Diagnostics” section that runs pass/fail checks for authentication state, admin authorization, and product list + safe CRUD verification with clear English error reporting.

**User-visible outcome:** Admins can log in with Internet Identity, reliably access the Admin Panel, manage products end-to-end with enforced backend authorization, and run a diagnostics report to verify auth/admin/CRUD stability.
