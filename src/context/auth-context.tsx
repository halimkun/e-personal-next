"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { setCookie } from 'cookies-next';

interface AuthContextProps {
  children: ReactNode;
}

interface ApiToken {
  token: string;
}

interface User {
  nik: string;
  nama: string;
  photo: string;
  departemen: string;
  dpt: {
    dep_id: string;
    nama: string;
    kelompok: string;
    aktif: string;
    tele_id: string;
  }
}

interface AuthContextType {
  user: User | null;
  token: ApiToken | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [token, setToken] = useState<ApiToken | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }).then((res) => res.json());

      if (response.success) {
        const accessToken = response.access_token;
        sessionStorage.setItem('access_token', accessToken);
        setToken(accessToken);
        setCookie('access_token', accessToken, {
          maxAge: 60 * 60 * 24,
          path: '/',
        });

        window.location.href = '/dashboard';
      } else {
        console.error('Login failed:', response.message);
        logout();
      }
    } catch (error) {
      console.error('Error during login:', error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setCookie('access_token', '', {
      maxAge: 0,
      path: '/',
    });
    sessionStorage.removeItem('access_token');
    window.location.href = '/auth/login'; // Redirect to login page after logout
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};