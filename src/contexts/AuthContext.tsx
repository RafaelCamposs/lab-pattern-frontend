import { useState, useEffect, type ReactNode } from 'react';
import { authApi, setTokenExpirationCallback, isTokenExpired } from '../services/api';
import { AuthContext, type User } from './AuthContextType';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken && !isTokenExpired()) {
      return { email: storedUser, token: storedToken };
    }
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

  useEffect(() => {
    setTokenExpirationCallback(() => {
      alert('Sua sessão expirou. Por favor, faça login novamente.');
      logout();
      window.location.href = '/login';
    });

    const checkTokenExpiration = () => {
      if (user && isTokenExpired()) {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        logout();
        window.location.href = '/login';
      }
    };

    checkTokenExpiration();
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
