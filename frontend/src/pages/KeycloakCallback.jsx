import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

export default function KeycloakCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code received from Keycloak');
      return;
    }

    api.post('/auth/keycloak/callback', {
      code,
      redirect_uri: window.location.origin + '/auth/keycloak/callback'
    })
    .then(res => {
      const { token, user } = res.data?.data || res.data;
      setSession(token, user);
      navigate('/', { replace: true });
    })
    .catch(err => {
      setError(err.response?.data?.message || 'Keycloak login failed. Please try again.');
    });
  }, []);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', padding: '20px' }}>
        <div style={{ background: '#111', padding: '40px', borderRadius: '12px', border: '1px solid #a37a39', textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ color: '#e57373', marginBottom: '12px' }}>Login Failed</h2>
          <p style={{ color: '#ccc', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            style={{
              background: 'linear-gradient(135deg, #a37a39, #c8952e)',
              color: '#fff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <Loading text="Completing Keycloak login..." />;
}
