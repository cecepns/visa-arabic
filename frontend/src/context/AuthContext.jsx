import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ksa-token');
    if (token) {
      api
        .get('/auth/me')
        .then((res) => setAdmin(res.data))
        .catch(() => {
          localStorage.removeItem('ksa-token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('ksa-token', res.data.token);
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('ksa-token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
