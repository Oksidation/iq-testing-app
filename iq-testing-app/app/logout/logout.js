// pages/logout.js
import { useEffect } from 'react';
import { supabaseClient } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await supabaseClient.auth.signOut();
      router.replace('/');
    }
    doLogout();
  }, [router]);

  return (
    <main style={{ padding: '1rem' }}>
      <p>Logging out...</p>
    </main>
  );
}
