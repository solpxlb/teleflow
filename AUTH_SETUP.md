# JWT Authentication Setup Instructions

## Step 1: Run Database Migrations

You need to run TWO SQL files in your Supabase SQL Editor:

### 1.1 Run `schema.sql` (if not already done)
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to SQL Editor → New query
3. Copy all contents from `d:\telflow\teleflow\schema.sql`
4. Paste and click "Run"

### 1.2 Run `permissions.sql` (NEW - Required for auth)
1. In SQL Editor → New query
2. Copy all contents from `d:\telflow\teleflow\permissions.sql`
3. Paste and click "Run"
4. This creates:
   - `permissions` table with all system permissions
   - `role_permissions` table mapping permissions to roles
   - `user_custom_permissions` for user-specific overrides
   - Default permissions for all roles
   - Super admin user profile

## Step 2: Create Super Admin Auth User

The `permissions.sql` creates the user **profile**, but you need to create the **auth user** in Supabase:

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click "Add user" → "Create new user"
3. Enter:
   - **Email**: `superadmin@teleflow.com`
   - **Password**: `SuperAdmin@2024!`
   - **Auto Confirm User**: ✅ (check this box)
4. Click "Create user"
5. **IMPORTANT**: Copy the User ID (UUID) that was generated
6. Go back to SQL Editor and run:
   ```sql
   UPDATE public.users 
   SET id = 'PASTE_THE_UUID_HERE'
   WHERE email = 'superadmin@teleflow.com';
   ```

## Step 3: Test the Login

1. Make sure your dev server is running (`npm run dev`)
2. Navigate to `http://localhost:5173`
3. You should see the new login page
4. Enter:
   - Email: `superadmin@teleflow.com`
   - Password: `SuperAdmin@2024!`
5. Click "Sign In"
6. You should be redirected to the dashboard

## Step 4: Access User Management

Once logged in as super admin:
1. Navigate to `/admin/users` (you'll need to add this route - see next steps)
2. You can create new users with different roles
3. Assign permissions dynamically

## What's Been Implemented

✅ **Database Schema**:
- Permissions tables
- Role-based permissions
- User custom permissions
- Super admin user profile

✅ **Authentication**:
- JWT-based login with Supabase Auth
- Email/password authentication
- Session management
- Permission checking utilities

✅ **State Management**:
- Real JWT authentication (no more mock login)
- User permissions in state
- `login()`, `signup()`, `logout()`, `checkAuth()` actions

✅ **UI Components**:
- New Login page with email/password form
- User Management page (super admin only)

## What's Still Needed

🔲 **Routes** (Next step):
- Add `/admin/users` route to App.tsx
- Add `/admin/permissions` route
- Create ProtectedRoute component
- Add `/unauthorized` page

🔲 **Permission Management UI**:
- Create PermissionManagement.tsx
- Visual permission matrix
- Role permission editing

🔲 **Access Control**:
- Protect routes based on permissions
- Hide/show UI elements based on permissions

## Troubleshooting

**Can't login?**
- Make sure you created the auth user in Supabase Dashboard
- Check that the email/password match exactly
- Verify the user ID was updated in the users table

**No permissions?**
- Run `permissions.sql` again
- Check that `role_permissions` table has data
- Verify the `get_user_permissions` function exists

**Tables don't exist?**
- Run `schema.sql` first
- Then run `permissions.sql`
- Check for errors in SQL Editor
