import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../services/auth_service';
import Cookies from 'js-cookie';
import userService from '../../services/auth_service';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: Boolean | false;
    loading: Boolean | true;
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
    const [isAuthenticated, setIsAuthenticated] = useState<Boolean | false>(false);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

    // Loading state
    const [loading, setLoading] = useState(true);

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
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { request } = userService.login({ email, password });
            const response = await request;
            const { accessToken, refreshToken, _id, username, email: userEmail } = response.data;

            const userData = { _id, username, email: userEmail, password: '' };

            // Store data in cookies (with secure attributes)
            Cookies.set('accessToken', accessToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('refreshToken', refreshToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('user', JSON.stringify(userData), { path: '/', secure: true, sameSite: 'Strict' });

            // Update React state
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
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
        <AuthContext.Provider value={{ loading, isAuthenticated, user, accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
