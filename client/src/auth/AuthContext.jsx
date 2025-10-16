import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        console.log('AuthContext: Starting login for', email);
        try {
            console.log('AuthContext: Sending fetch request to /api/auth/login');
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('AuthContext: Received response', response.status, response.ok);

            if (!response.ok) {
                const error = await response.json();
                console.log('AuthContext: Login failed with error:', error);
                throw new Error(error.message || 'Login failed');
            }

            const userData = await response.json();
            console.log('AuthContext: Login successful, user data:', userData);
            setUser(userData.user);
            localStorage.setItem('user', JSON.stringify(userData.user));
            localStorage.setItem('token', userData.token);

            return { success: true };
        } catch (error) {
            console.error('AuthContext: Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const register = async (firstName, lastName, email, password) => {
        console.log('AuthContext: Starting registration for', email);
        try {
            console.log('AuthContext: Sending fetch request to /api/auth/register');
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            });

            console.log('AuthContext: Received response', response.status, response.ok);

            if (!response.ok) {
                const error = await response.json();
                console.log('AuthContext: Registration failed with error:', error);
                throw new Error(error.message || 'Registration failed');
            }

            const userData = await response.json();
            console.log('AuthContext: Registration successful, user data:', userData);
            setUser(userData.user);
            localStorage.setItem('user', JSON.stringify(userData.user));
            localStorage.setItem('token', userData.token);

            return { success: true };
        } catch (error) {
            console.error('AuthContext: Registration error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = useMemo(
        () => ({
            user,
            isLoading,
            login,
            register,
            logout,
            isAuthenticated: !!user,
        }),
        [user, isLoading],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
