import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          // Refresh user profile in background
          const { data } = await api.get('/auth/me');
          if (data.success) {
            const updated = { ...parsed, ...data.data };
            setUser(updated);
            localStorage.setItem('user', JSON.stringify(updated));
          }
        } catch (error) {
          console.warn('Auth token expired or invalid:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      return data.data;
    }
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.success) {
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      return data.data;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (formData) => {
    const { data } = await api.put('/auth/updateprofile', formData);
    if (data.success) {
      const updated = { ...user, ...data.data };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        role: user?.role || 'guest',
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

export default AuthContext;
