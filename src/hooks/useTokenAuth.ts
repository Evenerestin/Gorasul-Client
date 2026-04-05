import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import api from '../lib/api';

export function useTokenAuth(onSuccess?: () => void) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return;

    api
      .post('/auth/token', { token })
      .then((res) => {
        window.dispatchEvent(new CustomEvent('auth-success', { detail: res.data.user }));
        setSearchParams((prev) => {
          prev.delete('token');
          return prev;
        });
        onSuccess?.();
      })
      .catch(() => {
        setSearchParams((prev) => {
          prev.delete('token');
          return prev;
        });
      });
  }, [setSearchParams, onSuccess, searchParams]);
}
