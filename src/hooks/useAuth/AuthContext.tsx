import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../services/auth_service';
import Cookies from 'js-cookie';
import userService from '../../services/auth_service';
import { AxiosError } from 'axios';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    updateUserSession: (updatedFields: Partial<User>) => void;
    logout: () => void;
    isAuthenticated: boolean; // Changed to boolean
    loading: boolean; // Changed to boolean
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Changed to boolean
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

    // Loading state
    const [loading, setLoading] = useState<boolean>(true); // Changed to boolean

    useEffect(() => {
        const storedAccessToken = Cookies.get('accessToken');
        const storedRefreshToken = Cookies.get('refreshToken');
        const storedUser = Cookies.get('user');

        if (storedAccessToken && storedRefreshToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setUser(parsedUser);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            logout();
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { request } = userService.login({ email, password });
            const response = await request;
            const { accessToken, refreshToken, _id, username, avatar, email: userEmail } = response.data;

            const userData = { _id, username, email: userEmail, avatar, password: '' };

            // Store data in cookies (with secure attributes)
            Cookies.set('accessToken', accessToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('refreshToken', refreshToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('user', JSON.stringify(userData), { path: '/', secure: true, sameSite: 'Strict' });

            // Update React state
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message;
                throw new Error(errorMessage || 'An unexpected error occurred');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }
    };

    const updateUserSession = (updatedFields: Partial<User>) => {
        // Ensure user exists before updating
        if (!user) return; 
    
        const updatedUser: User = {
            ...user,
            ...updatedFields,
        };
    
        setUser(updatedUser);
        Cookies.set("user", JSON.stringify(updatedUser), { path: "/", secure: true, sameSite: "Strict" });
    };

    const logout = async () => {
        // Check refresh token exists
        if (refreshToken) {
            try {
                const { request } = userService.logout(refreshToken);
                await request;
            } catch (error) {
                console.error("Logout failed", error);
            }
        }

        // Remove all States
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setIsAuthenticated(false);

        // Remove stored cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
    };

    // const registerUser = async (user: User) => {
    //     try {
    //         const { request } = userService.register(user);
    //         await request;
    //     } catch (error) {
    //         console.log('Error during registration:', error);
    //         throw new Error('Registration failed');
    //     }
    // };

    return (
        <AuthContext.Provider value={{ loading, isAuthenticated, user, accessToken, refreshToken, updateUserSession, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
