import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

function getToken() {
  try { return localStorage.getItem('token'); } catch {}
  try { return sessionStorage.getItem('token'); } catch {}
  return null;
}

function setToken(token, remember) {
  try {
    if (remember) {
      localStorage.setItem('token', token);
      try { sessionStorage.removeItem('token'); } catch {}
    } else {
      sessionStorage.setItem('token', token);
      try { localStorage.removeItem('token'); } catch {}
    }
  } catch {}
}

function removeToken() {
  try { localStorage.removeItem('token'); } catch {}
  try { sessionStorage.removeItem('token'); } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api.get('/auth/profile')
        .then((res) => setUser(res.data?.data || res.data))
        .catch(() => removeToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, remember = false) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.data.token, remember);
    setUser(res.data.data.user);
    return res.data;
  };

  const register = async (name, entreprise_name, email, phone, business_location, city, country, password, password_confirmation, remember = false) => {
    const res = await api.post('/auth/register', { name, entreprise_name, email, phone, business_location, city, country, password, password_confirmation });
    setToken(res.data.data.token, remember);
    setUser(res.data.data.user);
    return res.data;
  };

  const setSession = (token, user) => {
    setToken(token, true);
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Local cleanup regardless of server response
    }
    removeToken();
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    setUser(res.data?.data || res.data);
    return res.data;
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.data || res.data);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
