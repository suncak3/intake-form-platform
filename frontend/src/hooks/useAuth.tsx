import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            const userType = localStorage.getItem('user_type');

            if (token) {
                try {
                    if (userType === 'admin') {
                        const adminData = localStorage.getItem('user_data');
                        if (adminData) {
                            setUser(JSON.parse(adminData));
                            setIsAdmin(true);
                        }
                    } else {
                        const response = await apiService.getUserProfile();
                        setUser(response.user);
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error('Ошибка проверки авторизации:', error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiService.login({ email, password });

            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_type', 'user');
            localStorage.setItem('user_data', JSON.stringify(response.user));

            setUser(response.user!);
            setIsAdmin(false);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Ошибка входа');
        }
    };

    const adminLogin = async (email: string, password: string) => {
        try {
            const response = await apiService.adminLogin({ email, password });

            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_type', 'admin');
            localStorage.setItem('user_data', JSON.stringify(response.admin));

            setUser(response.admin!);
            setIsAdmin(true);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Ошибка входа администратора');
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const response = await apiService.register({ email, password });

            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_type', 'user');
            localStorage.setItem('user_data', JSON.stringify(response.user));

            setUser(response.user!);
            setIsAdmin(false);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Ошибка регистрации');
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_data');
        setUser(null);
        setIsAdmin(false);
    };

    const value: AuthContextType = {
        user,
        isAdmin,
        isLoading,
        login,
        adminLogin,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};