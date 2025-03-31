"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';
import { AuthError } from '@supabase/supabase-js';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push('/account');
      }
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#1a1a1a',
          padding: '2rem',
          borderRadius: '8px',
        }}
      >
        <h1
          style={{
            color: 'var(--color-accent)',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          Login
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: '#ff000015',
              border: '1px solid #ff000030',
              color: '#ff0000',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <label htmlFor="email" style={{ marginBottom: '0.5rem' }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              padding: '0.5rem',
              marginBottom: '1rem',
              background: '#333',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '4px',
            }}
          />

          <label htmlFor="password" style={{ marginBottom: '0.5rem' }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{
              padding: '0.5rem',
              marginBottom: '1.5rem',
              background: '#333',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '4px',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#fff',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              marginBottom: '1rem',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#fff' }}>
          Don&apos;t have an account yet?{' '}
          <Link href="/register" style={{ color: 'var(--color-accent)' }}>
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
