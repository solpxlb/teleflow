import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const auth = {
    /**
     * Sign in with email and password
     */
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign up a new user (admin only in production)
     */
    async signUp(email: string, password: string, userData: { name: string; role: string }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData,
            },
        });

        if (error) throw error;

        // Create user profile
        if (data.user) {
            const { error: profileError } = await supabase.from('users').insert({
                id: data.user.id,
                email: data.user.email,
                name: userData.name,
                role: userData.role,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
            });

            if (profileError) throw profileError;
        }

        return data;
    },

    /**
     * Sign out current user
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Get current authenticated user with profile
     */
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) throw error;
        if (!user) return null;

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) throw profileError;

        return profile;
    },

    /**
     * Get current session
     */
    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    },

    /**
     * Refresh session
     */
    async refreshSession() {
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        return session;
    },

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback: (event: string, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback);
    },
};
