"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";

export default function NavBar() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data, error }) => {
      if (!error) {
        setSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "SIGNED_OUT") {
        router.push("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    await supabaseClient.auth.signOut();
  }

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.brand}>
        IQ Tester
      </Link>
      <div style={styles.menu}>
        {!session && (
          <>
            <Link href="/register" style={styles.link}>
              Register
            </Link>
            <Link href="/login" style={styles.link}>
              Login
            </Link>
          </>
        )}

        {session && (
          <>
            <Link href="/account" style={styles.link}>
              Account
            </Link>
            <Link href="/tests" style={styles.link}>
              Tests
            </Link>
            <a href="#" onClick={handleLogout} style={styles.link}>
              Logout
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#111",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: "#fff",
    fontWeight: "bold",
    textDecoration: "none",
    fontSize: "1.25rem",
  },
  menu: {
    display: "flex",
    gap: "1rem",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    cursor: "pointer",
  },
} as const;