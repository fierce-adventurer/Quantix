import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { AuthResponseData, Tenant, User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (organizationName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('quantix_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setSession = (authData: AuthResponseData) => {
    if (authData.token) {
      localStorage.setItem('quantix_token', authData.token);
      setToken(authData.token);
    }
    setUser(authData.user);
    setTenant(authData.tenant);
  };

  const clearSession = () => {
    localStorage.removeItem('quantix_token');
    setToken(null);
    setUser(null);
    setTenant(null);
  };

  const refresh = async () => {
    const storedToken = localStorage.getItem('quantix_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<AuthResponseData>('/api/auth/me');
      if (response.data) {
        setUser(response.data.user);
        setTenant(response.data.tenant);
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponseData>('/api/auth/login', {
        email,
        password,
      });
      if (response.data) {
        setSession(response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (organizationName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponseData>('/api/auth/signup', {
        organizationName,
        email,
        password,
      });
      if (response.data) {
        setSession(response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        signup,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
