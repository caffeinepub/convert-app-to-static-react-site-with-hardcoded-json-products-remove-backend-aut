# Admin Routes Documentation

## Location
Admin routes are **NOT** defined in `frontend/src/routes/admin.tsx` (this file does not exist in the project).

Instead, all routing is defined in **`frontend/src/App.tsx`** using TanStack Router.

## Admin Routes

The following admin routes are configured:

1. **`/admin/login`** - Admin login page
   - Component: `AdminLogin` from `frontend/src/pages/AdminLogin.tsx`
   - Purpose: Authentication page for admin users

2. **`/admin`** - Admin dashboard
   - Component: `AdminDashboard` from `frontend/src/pages/AdminDashboard.tsx`
   - Purpose: Main admin control panel for managing content

## Route Structure

Routes are created using TanStack Router's `createRoute` API and attached to a root route:

