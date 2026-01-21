import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Secure token storage with validation
  const secureTokenStorage = {
    getToken: (): string | null => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        // Basic token validation
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.warn('Invalid token format');
          localStorage.removeItem('token');
          return null;
        }

        // Check if token is expired (basic check)
        let payload: any;
        try {
          const decodedPayload = atob(parts[1]);
          payload = JSON.parse(decodedPayload);
        } catch (parseError) {
          console.error('Failed to parse token payload:', parseError);
          localStorage.removeItem('token');
          return null;
        }

        if (payload.exp && payload.exp < Date.now() / 1000) {
          console.warn('Token expired');
          localStorage.removeItem('token');
          return null;
        }

        return token;
      } catch (error) {
        console.error('Error reading token:', error);
        localStorage.removeItem('token');
        return null;
      }
    },

    setToken: (token: string): void => {
      try {
        // Validate token format before storing
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid token format');
        }

        // Store in localStorage (persists across sessions)
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Error storing token:', error);
        throw error;
      }
    },

    removeToken: (): void => {
      localStorage.removeItem('token');
    }
  };

  const checkAuth = async () => {
    try {
      const token = secureTokenStorage.getToken();
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // 🎯 PRIMEIRO: Tentar extrair dados do token para fallback
      let fallbackUser: User | null = null;
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.sub && payload.email) {
            fallbackUser = {
              id: payload.sub,
              email: payload.email,
              name: payload.name || payload.email.split('@')[0] || 'Usuário',
              role: payload.role || 'user',
              createdAt: new Date().toISOString(),
            };
          }
        }
      } catch (decodeError) {
        // Silent fail
      }
      
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (apiError: any) {
        
        // Verificar tipo de erro
        const errorMessage = apiError.message?.toLowerCase() || '';
        const isNetworkError = 
          errorMessage.includes('fetch') || 
          errorMessage.includes('network') || 
          errorMessage.includes('conexão') ||
          errorMessage.includes('failed to') ||
          errorMessage.includes('timeout') ||
          errorMessage.includes('econnrefused') ||
          errorMessage.includes('net::');
          
        const isUnauthorizedError = 
          errorMessage.includes('401') ||
          errorMessage.includes('unauthorized') ||
          errorMessage.includes('não autorizado') ||
          errorMessage.includes('invalid') ||
          errorMessage.includes('expired') ||
          errorMessage.includes('session');
        
        // Se for erro de rede e temos fallback, usa os dados do token
        if (isNetworkError && fallbackUser) {
          setUser(fallbackUser);
          return;
        }
        
        // Se for erro de servidor (5xx) e temos fallback, também usa
        if ((errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) && fallbackUser) {
          setUser(fallbackUser);
          return;
        }
        
        // Se NÃO for erro de autenticação explícito e temos fallback, usa o fallback
        // Isso cobre casos onde não sabemos o tipo exato de erro
        if (!isUnauthorizedError && fallbackUser) {
          setUser(fallbackUser);
          return;
        }
        
        // Se for erro de autenticação explícito (401/unauthorized), remove token
        secureTokenStorage.removeToken();
        setUser(null);
      }
    } catch (error) {
      // Não remove token em erro crítico, pode ser problema temporário
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { user: loggedUser, token } = await authService.login(email, password);
    secureTokenStorage.setToken(token);
    setUser(loggedUser);
  };

  const register = async (email: string, password: string) => {
    const { user: newUser, token } = await authService.register(email, password);
    secureTokenStorage.setToken(token);
    setUser(newUser);
  };

  const logout = () => {
    secureTokenStorage.removeToken();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

