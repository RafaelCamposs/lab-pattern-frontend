import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, setTokenExpirationCallback, isTokenExpired } from '../services/api';

interface User {
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken && !isTokenExpired()) {
      return { email: storedUser, token: storedToken };
    }
    // Clear expired token
    if (storedUser && storedToken && isTokenExpired()) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return null;
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('practice-challenge-state');
  };

  // Set up token expiration callback
  useEffect(() => {
    setTokenExpirationCallback(() => {
      alert('Your session has expired. Please log in again.');
      logout();
      window.location.href = '/login';
    });

    // Check token expiration on mount and periodically
    const checkTokenExpiration = () => {
      if (user && isTokenExpired()) {
        alert('Your session has expired. Please log in again.');
        logout();
        window.location.href = '/login';
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const userData = { email, token: response.token };
    setUser(userData);
    localStorage.setItem('user', email);
    localStorage.setItem('token', response.token);
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await authApi.signup({ username, email, password });
    const userData = { email, token: response.token };
    setUser(userData);
    localStorage.setItem('user', email);
    localStorage.setItem('token', response.token);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
