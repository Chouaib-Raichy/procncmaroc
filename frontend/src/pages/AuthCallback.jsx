import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      handleGoogleCallback(token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  return <div style={{ textAlign: 'center', paddingTop: '100px', color: '#fff', background: '#000', minHeight: '100vh' }}>Signing in...</div>;
}