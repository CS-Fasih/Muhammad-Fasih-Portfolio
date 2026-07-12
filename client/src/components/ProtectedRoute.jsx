import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../lib/api';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [authState, setAuthState] = useState('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    apiRequest('/api/auth/me', { signal: controller.signal })
      .then((result) => {
        setAuthState(result?.authenticated ? 'authenticated' : 'unauthenticated');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        if (error.status === 401) {
          setAuthState('unauthenticated');
          return;
        }
        setErrorMessage(error.message);
        setAuthState('error');
      });

    return () => controller.abort();
  }, [attempt]);

  if (authState === 'checking') {
    return (
      <main className="admin-gate" aria-busy="true">
        <div className="admin-gate__panel">
          <span className="admin-spinner" aria-hidden="true" />
          <p role="status">Checking your session…</p>
        </div>
      </main>
    );
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (authState === 'error') {
    return (
      <main className="admin-gate">
        <div className="admin-gate__panel" role="alert">
          <h1>Unable to verify session</h1>
          <p>{errorMessage}</p>
          <button
            className="btn-primary"
            type="button"
            onClick={() => {
              setAuthState('checking');
              setErrorMessage('');
              setAttempt((value) => value + 1);
            }}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return children;
}
