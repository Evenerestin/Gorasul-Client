import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import api from '../lib/api';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', '/');
      api
        .get('/auth/me')
        .then((res) => {
          window.dispatchEvent(new CustomEvent('auth-success', { detail: res.data.user }));
          navigate('/');
        })
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/login?error=auth_failed');
        });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-white">Logowanie przez Discord...</p>
    </div>
  );
}
