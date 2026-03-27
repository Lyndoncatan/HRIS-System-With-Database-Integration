import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin';

interface AuthContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    logout: () => Promise<void>;
    isLoggedIn: boolean;
    setIsLoggedIn: (v: boolean) => void;
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
    signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
    signInWithGoogle: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<UserRole>(() => {
        const savedRole = localStorage.getItem('user_role');
        return (savedRole as UserRole) || 'user';
    });

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen for Supabase auth state changes
    useEffect(() => {
        // Get the initial session
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setIsLoggedIn(!!currentSession);
            setLoading(false);
        });

        // Subscribe to auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession);
                setUser(newSession?.user ?? null);
                setIsLoggedIn(!!newSession);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Persist role to localStorage
    useEffect(() => {
        localStorage.setItem('user_role', role);
    }, [role]);

    // --- Auth Methods ---

    const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return { error: null };
    };

    const signUpWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) return { error: error.message };
        return { error: null };
    };

    const signInWithGoogle = async (): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard',
            },
        });
        if (error) return { error: error.message };
        return { error: null };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setRole('user');
        setUser(null);
        setSession(null);
        localStorage.removeItem('user_role');
    };

    return (
        <AuthContext.Provider value={{
            role, setRole, logout, isLoggedIn, setIsLoggedIn,
            user, session, loading,
            signInWithEmail, signUpWithEmail, signInWithGoogle,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};