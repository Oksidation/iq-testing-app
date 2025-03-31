"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';

type TestType = {
  id: string;
  title: string;
  description?: string | null;
};

export default function TestsIndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<TestType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkUserAndFetchTests() {
      setLoading(true);
      setError(null);

      try {
        // 1) Check Supabase session
        const {
          data: { session },
          error: sessionError,
        } = await supabaseClient.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
          // Not logged in → redirect
          router.replace('/login');
          return;
        }

        // 2) Fetch all tests from "tests" table
        const { data: testsData, error: testsError } = await supabaseClient
          .from('tests')
          .select('*');

        if (testsError) throw testsError;

        setTests(testsData || []);
      } catch (err: any) {
        console.error('Error:', err);
        setError(
          typeof err?.message === 'string'
            ? err.message
            : 'An error occurred while fetching tests'
        );
      } finally {
        setLoading(false);
      }
    }

    checkUserAndFetchTests();
  }, [router]);

  if (loading) {
    return (
      <main
        style={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <p style={{ color: '#fff' }}>Loading...</p>
      </main>
    );
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
          maxWidth: '800px',
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
            fontSize: '1.75rem',
          }}
        >
          All Tests
        </h1>

        {/* If there's an error */}
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

        {/* If no tests found */}
        {tests.length === 0 ? (
          <div
            style={{
              backgroundColor: '#333',
              padding: '1rem',
              borderRadius: '4px',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <p>No tests found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tests.map((test) => (
              <div
                key={test.id}
                style={{
                  backgroundColor: '#333',
                  padding: '1rem',
                  borderRadius: '4px',
                }}
              >
                <h2
                  style={{
                    color: 'var(--color-accent)',
                    marginBottom: '0.5rem',
                    fontSize: '1.25rem',
                  }}
                >
                  {test.title}
                </h2>
                <p style={{ marginBottom: '1rem', color: '#fff' }}>
                  {test.description}
                </p>

                <Link
                  href={`/tests/${test.id}/instructions`}
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Take Test
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
