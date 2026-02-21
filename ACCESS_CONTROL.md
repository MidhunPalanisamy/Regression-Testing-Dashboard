# Access Control Implementation

## Overview
The application now displays an "Access Denied" page when users try to access pages that are not permitted for their role.

## Changes Made

### 1. Access Denied Page (`/rtd-fe/src/pages/AccessDenied.jsx`)
- Professional error page with clear messaging
- Shows current user role
- Provides navigation options:
  - "Go to Dashboard" button
  - "Go Back" button
- Styled with Tailwind CSS matching the app theme

### 2. Updated ProtectedRoute Component
- Changed redirect from `/dashboard` to `/access-denied` when role check fails
- Users without proper permissions now see the Access Denied page instead of being silently redirected

### 3. Updated App.jsx Routes
- Added `/access-denied` route (accessible to all authenticated users)
- Added explicit `allowedRoles` to all protected routes:
  - Dashboard: `['ADMIN', 'TESTER', 'VIEWER']`
  - Builds: `['ADMIN', 'TESTER', 'VIEWER']`
  - Test Cases: `['ADMIN', 'TESTER', 'VIEWER']`
  - Build Comparison: `['ADMIN', 'TESTER', 'VIEWER']`
  - Regression Runs: `['ADMIN', 'TESTER', 'VIEWER']`
  - Users: `['ADMIN']` only
- Added catch-all route (`*`) to redirect undefined paths to dashboard

## Role-Based Access Control

### ADMIN
- Full access to all pages
- Can create/edit/delete builds
- Can create/edit/delete test cases
- Can execute regression runs
- Can manage users (exclusive access)

### TESTER
- Access to all pages except User Management
- Can create/edit builds
- Can create/edit/delete test cases
- Can execute regression runs
- Cannot access `/users` page (will see Access Denied)

### VIEWER
- Read-only access to all pages except User Management
- Cannot create/edit/delete any data
- UI elements for modifications are hidden
- Cannot access `/users` page (will see Access Denied)

## User Experience

### Unauthorized Access Attempt
1. User tries to access a restricted page (e.g., TESTER tries to access `/users`)
2. ProtectedRoute checks user role against allowedRoles
3. User is redirected to `/access-denied` page
4. Access Denied page displays:
   - Warning icon
   - "Access Denied" heading
   - Permission message
   - Current user role badge
   - Navigation buttons
   - Contact administrator message

### Sidebar Menu
- Sidebar already filters menu items based on user role
- Users only see menu items they have permission to access
- Prevents confusion and accidental unauthorized access attempts

## Testing Scenarios

### Test as ADMIN
- Should access all pages including `/users`
- Should see all action buttons (Create, Edit, Delete)

### Test as TESTER
- Should access all pages except `/users`
- Attempting to access `/users` shows Access Denied page
- Should see Create/Edit buttons but not Delete (except for test cases)

### Test as VIEWER
- Should access Dashboard, Builds, Test Cases, Comparison, Regression pages
- Attempting to access `/users` shows Access Denied page
- Should NOT see any Create/Edit/Delete buttons
- All data is read-only

### Test Invalid Routes
- Accessing undefined routes (e.g., `/invalid-page`) redirects to dashboard
- No broken pages or 404 errors

## Security Notes

1. **Frontend Protection**: Routes are protected at the component level
2. **Backend Protection**: API endpoints enforce role-based access with `@PreAuthorize` annotations
3. **Double Layer Security**: Both frontend and backend validate permissions
4. **Token Validation**: JWT tokens include role information validated on each request
5. **UI Consistency**: Action buttons are hidden for users without permissions

## Future Enhancements

- Add more granular permissions (e.g., read-only TESTER role)
- Implement permission-based feature flags
- Add audit logging for access denied attempts
- Create admin dashboard to view access patterns
