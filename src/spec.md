# Specification

## Summary
**Goal:** Restore reliable admin dashboard access and ensure the specified Internet Identity principal is recognized as an admin.

**Planned changes:**
- Add/verify backend admin role configuration so principal `ix7jl-xlknv-uwyet-3fsxh-x7nqh-zkhvg-keqsk-zs4hv-ihh5p-uytti-6ae` is granted admin privileges and admin-only methods authorize correctly.
- Ensure the admin-check method used by the frontend `useIsCallerAdmin` hook returns the correct result for admins vs non-admins.
- Fix the frontend admin flow end-to-end: Internet Identity login, admin role check, and rendering/navigation for `/admin` without blank screens or redirect loops.
- Update `/admin` and `/admin/login` to show a clear access-denied message for logged-in non-admin users.
- Ensure any existing “bootstrap admin” action is not required for the configured admin principal, and shows a clear error message when unauthorized.
- Preserve existing canister state across upgrade; apply changes without wiping existing data.

**User-visible outcome:** Admin users (including the specified principal) can log in with Internet Identity and reliably access the Admin Dashboard at `/admin`, while non-admin users see a clear access-denied message instead of loops or silent failures.
