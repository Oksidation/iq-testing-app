"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

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
      <a href="/" style={styles.brand}>
        IQ Tester
      </a>
      <div style={styles.menu}>
        {!session && (
          <>
            <a href="/register" style={styles.link}>
              Register
            </a>
            <a href="/login" style={styles.link}>
              Login
            </a>
          </>
        )}

        {session && (
          <>
            <a href="/account" style={styles.link}>
              Account
            </a>
            <a href="/tests" style={styles.link}>
              Tests
            </a>
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