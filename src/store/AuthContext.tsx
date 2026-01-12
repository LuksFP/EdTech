import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, AuthState, LoginCredentials } from '@/types';
import { mockUsers } from '@/services/mockData';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedUser = localStorage.getItem('edtech_user');
    if (savedUser) {
      return {
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false
      };
    }
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false
    };
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(
      u => u.email === credentials.email
    );
    
    if (user && credentials.password === '123456') {
      localStorage.setItem('edtech_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('edtech_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
