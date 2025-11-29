import { User } from './mockData';
import { supabase } from './supabase';

// Permission types
export interface Permission {
    id: string;
    name: string;
    description: string;
    category: 'dashboard' | 'sites' | 'tasks' | 'workflows' | 'documents' | 'team' | 'analytics' | 'admin';
}

// Permission constants
export const PERMISSIONS = {
    // Dashboard
    VIEW_DASHBOARD: 'view_dashboard',
    VIEW_ANALYTICS: 'view_analytics',

    // Sites
    VIEW_SITES: 'view_sites',
    CREATE_SITES: 'create_sites',
    EDIT_SITES: 'edit_sites',
    DELETE_SITES: 'delete_sites',

    // Tasks
    VIEW_TASKS: 'view_tasks',
    CREATE_TASKS: 'create_tasks',
    EDIT_TASKS: 'edit_tasks',
    DELETE_TASKS: 'delete_tasks',
    ASSIGN_TASKS: 'assign_tasks',

    // Workflows
    VIEW_WORKFLOWS: 'view_workflows',
    CREATE_WORKFLOWS: 'create_workflows',
    EDIT_WORKFLOWS: 'edit_workflows',
    DELETE_WORKFLOWS: 'delete_workflows',
    EXECUTE_WORKFLOWS: 'execute_workflows',

    // Documents
    VIEW_DOCUMENTS: 'view_documents',
    UPLOAD_DOCUMENTS: 'upload_documents',
    EDIT_DOCUMENTS: 'edit_documents',
    DELETE_DOCUMENTS: 'delete_documents',

    // Team
    VIEW_TEAM: 'view_team',
    MANAGE_TEAM: 'manage_team',

    // Admin
    MANAGE_USERS: 'manage_users',
    MANAGE_PERMISSIONS: 'manage_permissions',
    VIEW_SYSTEM_SETTINGS: 'view_system_settings',
    EDIT_SYSTEM_SETTINGS: 'edit_system_settings',
} as const;

/**
 * Fetch user's effective permissions
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
    const { data, error } = await supabase.rpc('get_user_permissions', {
        user_uuid: userId,
    });

    if (error) {
        console.error('Error fetching permissions:', error);
        return [];
    }

    return data.map((row: any) => row.permission_name);
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(userPermissions: string[], permission: string): boolean {
    return userPermissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(userPermissions: string[], permissions: string[]): boolean {
    return permissions.some(p => userPermissions.includes(p));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(userPermissions: string[], permissions: string[]): boolean {
    return permissions.every(p => userPermissions.includes(p));
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: string): boolean {
    return user?.role === role;
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user: User | null): boolean {
    return user?.role === 'super_admin';
}

/**
 * Check if user is admin or super admin
 */
export function isAdmin(user: User | null): boolean {
    return user?.role === 'admin' || user?.role === 'super_admin';
}

/**
 * Check if user can access a feature
 */
export function canAccess(userPermissions: string[], feature: string): boolean {
    return hasPermission(userPermissions, feature);
}

/**
 * Get all permissions
 */
export async function getAllPermissions(): Promise<Permission[]> {
    const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

/**
 * Get role permissions
 */
export async function getRolePermissions(role: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('role_permissions')
        .select('permission_id, permissions(name)')
        .eq('role', role);

    if (error) throw error;
    return data?.map((rp: any) => rp.permissions.name) || [];
}

/**
 * Update role permissions
 */
export async function updateRolePermissions(role: string, permissionIds: string[]): Promise<void> {
    // Delete existing permissions for this role
    await supabase
        .from('role_permissions')
        .delete()
        .eq('role', role);

    // Insert new permissions
    if (permissionIds.length > 0) {
        const { error } = await supabase
            .from('role_permissions')
            .insert(permissionIds.map(permissionId => ({ role, permission_id: permissionId })));

        if (error) throw error;
    }
}

/**
 * Grant custom permission to user
 */
export async function grantUserPermission(userId: string, permissionId: string): Promise<void> {
    const { error } = await supabase
        .from('user_custom_permissions')
        .upsert({
            user_id: userId,
            permission_id: permissionId,
            granted: true,
        });

    if (error) throw error;
}

/**
 * Revoke custom permission from user
 */
export async function revokeUserPermission(userId: string, permissionId: string): Promise<void> {
    const { error } = await supabase
        .from('user_custom_permissions')
        .upsert({
            user_id: userId,
            permission_id: permissionId,
            granted: false,
        });

    if (error) throw error;
}
