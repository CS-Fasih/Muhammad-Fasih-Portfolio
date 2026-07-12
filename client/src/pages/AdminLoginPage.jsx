import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import useDocumentMetadata from '../hooks/useDocumentMetadata';
import { apiRequest } from '../lib/api';

export default function AdminLoginPage() {
  useDocumentMetadata(
    'Activity Admin | Muhammad Fasih',
    'Secure administrator access for Muhammad Fasih’s activity feed.',
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const requestedDestination = location.state?.from;
  const destination = typeof requestedDestination === 'string'
    && requestedDestination.startsWith('/admin/')
    ? requestedDestination
    : '/admin/activity';

  useEffect(() => {
    const controller = new AbortController();
    apiRequest('/api/auth/me', { signal: controller.signal })
      .then((result) => setStatus(result?.authenticated ? 'authenticated' : 'idle'))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        if (error.status !== 401) setErrorMessage(error.message);
        setStatus('idle');
      });
    return () => controller.abort();
  }, []);

  if (status === 'authenticated') {
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;

    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Enter your administrator email and password.');
      return;
    }

    setStatus('submitting');
    try {
      await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email: email.trim(), password },
      });
      setStatus('authenticated');
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(
        error.status === 400 || error.status === 401
          ? 'Invalid email or password.'
          : error.message,
      );
      setStatus('idle');
    }
  };

  return (
    <main className="admin-login">
      <section className="admin-login__panel" aria-labelledby="admin-login-title">
        <Link className="admin-login__brand" to="/" aria-label="Muhammad Fasih homepage">
          Muhammad <span>Fasih</span>
        </Link>
        <p className="admin-login__eyebrow">Private access</p>
        <h1 id="admin-login-title">Activity Admin</h1>
        <p className="admin-login__intro">Sign in to publish and manage portfolio activity.</p>

        {status === 'checking' ? (
          <div className="admin-login__checking" aria-busy="true">
            <span className="admin-spinner" aria-hidden="true" />
            <p role="status">Checking your session…</p>
          </div>
        ) : (
          <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="admin-email">Email address</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <p className="form-message form-message--error" role="alert" aria-live="assertive">
              {errorMessage}
            </p>

            <button className="btn-primary admin-login__submit" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Signing In…' : 'Sign In'}
            </button>
          </form>
        )}

        <Link className="admin-login__back" to="/activity">← Back to public activity</Link>
      </section>
    </main>
  );
}
