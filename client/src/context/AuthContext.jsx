import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const userData = await authAPI.getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const userData = await authAPI.login(credentials);
            setUser(userData);
            return userData;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            console.log('AuthContext: Starting registration with data:', {
                ...userData,
                password: userData.password ? '***' : undefined
            });
            
            setError(null);
            // User is automatically logged in after registration
            const newUser = await authAPI.register(userData);
            
            console.log('AuthContext: Registration successful, user data:', {
                ...newUser,
                _id: newUser._id
            });
            
            setUser(newUser);
            return newUser;
        } catch (error) {
            console.error('AuthContext: Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed';
            console.error('AuthContext: Setting error message:', errorMessage);
            setError(errorMessage);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Logout failed');
            throw error;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 