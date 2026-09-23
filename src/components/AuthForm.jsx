import { useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function AuthForm() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const credentials = { email, password };
    const { data, error: authError } = isRegister
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials);

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    // With email confirmation turned off, sign-up logs the user in immediately.
    if (isRegister && !data.session) {
      setMessage('Account created. Check your email to confirm it, then log in.');
    }
  }

  function switchMode() {
    setMode(isRegister ? 'login' : 'register');
    setError('');
    setMessage('');
  }

  return (
    <form className="card auth-form" onSubmit={handleSubmit}>
      <h2>{isRegister ? 'Create an account' : 'Log in'}</h2>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        minLength={6}
        required
      />

      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="notice">{message}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Please wait...' : isRegister ? 'Register' : 'Log in'}
      </button>

      <button type="button" className="link-button" onClick={switchMode}>
        {isRegister ? 'Already have an account? Log in' : "Don't have an account? Register"}
      </button>
    </form>
  );
}
