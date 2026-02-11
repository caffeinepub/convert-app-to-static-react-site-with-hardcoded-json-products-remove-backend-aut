# Specification

## Summary
**Goal:** Replace the admin area’s Internet Identity login with a simple username/password login backed by server-side sessions, and add basic admin user management.

**Planned changes:**
- Remove/disable any Internet Identity UI and logic from the admin login and admin navigation so the admin flow never triggers Internet Identity authentication.
- Implement a new `/admin/login` screen with Username/Password fields, English error messaging, and login/logout controls.
- Add backend login/logout endpoints to create/invalidate an admin session token and enforce authorization for all admin-only backend methods using that session (not Internet Identity principals).
- Update admin routing so `/admin` requires a valid admin session (redirect to `/admin/login` when not logged in) while keeping existing admin panels functional.
- Add a User Management panel in the admin dashboard to list users and create new users with username, password, and role (`admin`/`user`), where only `admin` role can access `/admin`.
- Seed/allow login with the initial primary admin credentials: Username `Administrator`, Password `AdminAAboxes26`.

**User-visible outcome:** Users can no longer use Internet Identity to access the admin area; admins can log in at `/admin/login` using username/password (session persists until logout), access the existing admin dashboard tabs, log out, and manage additional users/roles from a User Management panel.
