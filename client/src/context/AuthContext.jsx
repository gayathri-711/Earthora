import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('earthora_user') || localStorage.getItem('agriva_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('earthora_token') || localStorage.getItem('agriva_token'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('earthora_token') || localStorage.getItem('agriva_token')));

  const saveSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    if (nextUser && nextToken) {
      localStorage.setItem('earthora_user', JSON.stringify(nextUser));
      localStorage.setItem('earthora_token', nextToken);
    } else {
      localStorage.removeItem('earthora_user');
      localStorage.removeItem('earthora_token');
      localStorage.removeItem('agriva_user');
      localStorage.removeItem('agriva_token');
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('earthora_token') || localStorage.getItem('agriva_token');
    if (!currentToken) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
      localStorage.setItem('earthora_user', JSON.stringify(data.data.user));
    } catch {
      saveSession(null, null);
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data.data.user, data.data.token);
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    if (data.data?.token) {
      saveSession(data.data.user, data.data.token);
    }
    return {
      user: data.data?.user,
      token: data.data?.token,
      requiresApproval: Boolean(data.data?.requiresApproval),
      message: data.message,
    };
  };

  const logout = () => {
    saveSession(null, null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('earthora_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

