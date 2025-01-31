import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../services/auth_service';
import userService from '../services/auth_service';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (user: User) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;  // Define the children prop
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {  // Use AuthProviderProps for type definition
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

    useEffect(() => {
        if (accessToken) {
            // Optionally fetch the user details here using the access token
        }
    }, [accessToken]);

    const login = async (email: string, password: string) => {
        try {
            const { request } = userService.login({ email, password });
            const response = await request;
            const { accessToken, refreshToken, _id, username, email: userEmail } = response.data;

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUser({ _id, username, email: userEmail, password: '' });

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Redirect to profile page or dashboard
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const register = async (user: User) => {
        try {
            const { request } = userService.register(user);
            await request;
        } catch (error) {
            console.log('Error during registration:', error);
            throw new Error('Registration failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
