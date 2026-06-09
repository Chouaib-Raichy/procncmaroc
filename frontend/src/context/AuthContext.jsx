import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function setToken(token, remember) {
  if (remember) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token');
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token');
  }
}

function removeToken() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api.get('/profile')
        .then((res) => setUser(res.data.user || res.data))
        .catch(() => removeToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, remember = false) => {
    const res = await api.post('/login', { email, password });
    setToken(res.data.token, remember);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, phone, business_location, password, password_confirmation, remember = false) => {
    const res = await api.post('/register', { name, email, phone, business_location, password, password_confirmation });
    setToken(res.data.token, remember);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post('/logout');
    removeToken();
    setUser(null);
  };

  const updateProfile = async (formData) => {
    const res = await api.post('/profile/update', formData);
    setUser(res.data.user || res.data);
    return res.data;
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/profile');
      setUser(res.data.user || res.data);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
