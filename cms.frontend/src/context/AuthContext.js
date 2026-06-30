import React, { createContext, useContext, useState, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('customer');
        return saved ? JSON.parse(saved) : null;
    });

    const login = useCallback(async (email, password) => {
        const res = await authService.login({ Email: email, Password: password, FullName: "-" });
        const customer = res.customer;
        localStorage.setItem('customer', JSON.stringify(customer));
        setUser(customer);
        return customer;
    }, []);

    const register = useCallback(async (data) => {
        const res = await authService.register(data);
        return res;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('customer');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
