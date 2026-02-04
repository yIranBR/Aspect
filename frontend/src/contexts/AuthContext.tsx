import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/api';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: 'patient' | 'admin') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    console.log('AuthContext: Loading stored data...');
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        console.log('AuthContext: Token found, validating...');
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const response = await authService.getProfile();
        console.log('AuthContext: Profile validated successfully');
        setUser(response.data);
      } catch (error) {
        console.error('AuthContext: Token validation failed', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      console.log('AuthContext: No token found');
    }
    
    console.log('AuthContext: Loading complete');
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login...');
      const response = await authService.login({ email, password });
      console.log('AuthContext: Login response received', response.data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      console.log('AuthContext: Login successful');
    } catch (error) {
      console.error('AuthContext: Login failed', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role?: 'patient' | 'admin') => {
    try {
      console.log('AuthContext: Attempting registration...');
      const response = await authService.register({ email, password, name, role });
      console.log('AuthContext: Registration response received', response.data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      console.log('AuthContext: Registration successful');
    } catch (error) {
      console.error('AuthContext: Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        setUser: updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
