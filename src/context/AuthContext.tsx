// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

interface AuthUser {
  id: string;
  email: string;
  profile?: {
    first_name: string;
    last_name: string;
    phone: string;
    role: 'customer' | 'admin' | 'staff';
  };
}

interface AuthContextType {
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // On mount, try to restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('tanelia_token');
    if (token) {
      api.auth.getMe()
        .then((data: any) => {
          setAuthUser({
            id: data.user.id,
            email: data.user.email,
            profile: data.user.profile,
          });
        })
        .catch(() => {
          localStorage.removeItem('tanelia_token');
        })
        .finally(() => setIsAuthLoading(false));
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const setSessionFromMe = async (token: string) => {
    localStorage.setItem('tanelia_token', token);
    const data = await api.auth.getMe();
    setAuthUser({
      id: data.user.id,
      email: data.user.email,
      profile: data.user.profile,
    });
  };

  const login = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const data = await api.auth.login(email, password);
      if (!data.session?.access_token) {
        throw new Error('We could not start your session. Please confirm your email address or try again.');
      }
      await setSessionFromMe(data.session.access_token);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
    setAuthError(null);
    try {
      const res: any = await api.auth.register(data);
      if (res.session?.access_token) {
        await setSessionFromMe(res.session.access_token);
      } else {
        throw new Error('Your account was created. Please confirm your email address before signing in.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    await api.auth.logout().catch(() => {});
    localStorage.removeItem('tanelia_token');
    setAuthUser(null);
  };

  const clearAuthError = () => setAuthError(null);

  const isAdmin = authUser?.profile?.role === 'admin' || authUser?.profile?.role === 'staff';

  return (
    <AuthContext.Provider value={{
      authUser,
      isAuthenticated: !!authUser,
      isAuthLoading,
      isAdmin,
      login,
      register,
      logout,
      authError,
      clearAuthError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
