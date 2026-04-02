import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import api from '../lib/api';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Discord OAuth error:', error);
      navigate('/');
      return;
    }

    if (code) {
      api
        .post('/auth/discord', { code })
        .then((res) => {
          window.dispatchEvent(new CustomEvent('auth-success', { detail: res.data.user }));
          navigate('/');
        })
        .catch((err) => {
          console.error('Auth error:', err);
          navigate('/');
        });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-white">Logowanie przez Discord...</p>
    </div>
  );
}
