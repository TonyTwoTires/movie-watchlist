import { useEffect, useState } from 'react';
import { supabase, isConfigured } from './supabaseClient.js';
import AuthForm from './components/AuthForm.jsx';

export default function App() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setChecking(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!isConfigured) {
    return (
      <main className="container">
        <h1>Movie Watchlist</h1>
        <p className="error">
          Missing Supabase settings. Copy .env.example to .env and add your project URL and key.
        </p>
      </main>
    );
  }

  if (checking) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="app-header">
        <h1>Movie Watchlist</h1>
        {session && (
          <div className="user-info">
            <span>{session.user.email}</span>
            <button type="button" onClick={() => supabase.auth.signOut()}>
              Log out
            </button>
          </div>
        )}
      </header>

      {session ? (
        <section className="card">
          <p>You are logged in. Your movies will appear here.</p>
        </section>
      ) : (
        <AuthForm />
      )}
    </main>
  );
}
