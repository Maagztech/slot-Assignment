"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
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

function readStoredAuth(): { user: User | null; token: string | null } {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!savedToken || !savedUser) {
    return { user: null, token: null };
  }

  try {
    return {
      token: savedToken,
      user: JSON.parse(savedUser) as User,
    };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialAuth = readStoredAuth();
  const [user, setUser] = useState<User | null>(initialAuth.user);
  const [token, setToken] = useState<string | null>(initialAuth.token);
  const [loading] = useState(false);

  const persistAuth = (nextUser: User | null, nextToken: string | null) => {
    setUser(nextUser);
    setToken(nextToken);

    if (typeof window === "undefined") {
      return;
    }

    if (nextUser && nextToken) {
      localStorage.setItem("token", nextToken);
      localStorage.setItem("user", JSON.stringify(nextUser));
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const login = async (account: string, password: string) => {
    const response = await api.loginOrSignup(account, password);
    persistAuth(response.user, response.accessToken);
  };

  const signup = async (account: string, password: string) => {
    const response = await api.loginOrSignup(account, password);
    persistAuth(response.user, response.accessToken);
  };

  const logout = () => {
    persistAuth(null, null);
  };

  const updateWallet = (balance: number) => {
    if (!user) {
      return;
    }

    persistAuth({ ...user, wallet_balance: balance }, token);
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
