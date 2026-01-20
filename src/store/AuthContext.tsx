import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const [session, setSession] = useState<Session | null>(null);

  // Fetch user profile and role from database
  const fetchUserData = useCallback(async (userId: string, email: string) => {
    try {
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // Get role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      const user: User = {
        id: userId,
        email: email,
        name: profile?.name || email.split('@')[0],
        role: (roleData?.role as UserRole) || 'student',
        avatar: profile?.avatar || undefined,
        createdAt: profile?.created_at
      };

      return user;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(async () => {
            const userData = await fetchUserData(session.user.id, session.user.email || '');
            setAuthState({
              user: userData,
              isAuthenticated: true,
              isLoading: false
            });
          }, 0);
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      // Handle invalid/expired refresh tokens
      if (error && error.message?.includes('Refresh Token')) {
        console.warn('Invalid refresh token, signing out...');
        supabase.auth.signOut();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        return;
      }
      
      setSession(session);
      
      if (session?.user) {
        fetchUserData(session.user.id, session.user.email || '').then(userData => {
          setAuthState({
            user: userData,
            isAuthenticated: true,
            isLoading: false
          });
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      const userData = await fetchUserData(data.user.id, data.user.email || '');
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return { success: false, error: 'Erro desconhecido' };
  }, [fetchUserData]);

  const signup = useCallback(async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name }
      }
    });
    
    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      if (error.message.includes('already registered')) {
        return { success: false, error: 'Este email já está cadastrado' };
      }
      
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      // Wait for trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = await fetchUserData(data.user.id, data.user.email || '');
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return { success: false, error: 'Erro ao criar conta' };
  }, [fetchUserData]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  const refreshUser = useCallback(async () => {
    if (session?.user) {
      const userData = await fetchUserData(session.user.id, session.user.email || '');
      setAuthState(prev => ({
        ...prev,
        user: userData,
      }));
    }
  }, [session, fetchUserData]);

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, refreshUser }}>
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
