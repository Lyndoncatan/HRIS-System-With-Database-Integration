import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type UserRole = 'user' | 'admin';

interface AuthContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    logout: () => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 1. Initialize state lazily from localStorage to survive page refreshes
    const [role, setRole] = useState<UserRole>(() => {
        const savedRole = localStorage.getItem('user_role');
        return (savedRole as UserRole) || 'user';
    });

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        const savedLoginState = localStorage.getItem('is_logged_in');
        return savedLoginState === 'true';
    });

    // 2. Automatically update localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('user_role', role);
    }, [role]);

    useEffect(() => {
        localStorage.setItem('is_logged_in', String(isLoggedIn));
    }, [isLoggedIn]);

    // 3. Clear localStorage on logout
    const logout = () => {
        setIsLoggedIn(false);
        setRole('user');
        localStorage.removeItem('user_role');
        localStorage.removeItem('is_logged_in');
    };

    return (
        <AuthContext.Provider value={{ role, setRole, logout, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};