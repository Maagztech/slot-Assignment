"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as api from "@/lib/api";

interface User {
    _id: string;
    account: string;
    wallet_balance: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (account: string, password: string) => Promise<void>;
    signup: (account: string, password: string) => Promise<void>;
    logout: () => void;
    updateWallet: (balance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (account: string, password: string) => {
        const response = await api.loginOrSignup(account, password);
        const { user: userData, accessToken } = response;

        setUser(userData);
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const signup = async (account: string, password: string) => {
        const response = await api.loginOrSignup(account, password);
        const { user: userData, accessToken } = response;

        setUser(userData);
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const updateWallet = (balance: number) => {
        if (user) {
            const updatedUser = { ...user, wallet_balance: balance };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user && !!token,
                loading,
                login,
                signup,
                logout,
                updateWallet,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
