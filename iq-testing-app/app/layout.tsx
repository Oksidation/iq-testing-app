"use client";

import "./globals.css";
import { ReactNode, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // 1) Get initial session
    supabaseClient.auth.getSession().then(({ data, error }) => {
      if (!error) {
        setSession(data.session);
      } else {
        console.error("Error fetching session:", error);
      }
    });

    // 2) Subscribe to auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "SIGNED_OUT") {
        router.push("/");
      }
    });

    // 3) Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Logout using an <a> link
  async function handleLogout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault(); // Prevent following the link
    await supabaseClient.auth.signOut();
    // onAuthStateChange will handle clearing session & redirect
  }

  return (
    <html lang="en">
      <head>
        <title>IQ Testing Platform</title>
        <meta
          name="description"
          content="Test your IQ, EQ, and more, in a dark minimal UI."
        />
      </head>
      <body>
        {/* NAVBAR */}
        <nav style={styles.nav}>
          <a href="/" style={styles.brand}>
            IQ Tester
          </a>
          <div style={styles.menu}>
            {/* If no session: Register & Login */}
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

            {/* If session: Account, Tests, Logout */}
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

        {/* MAIN CONTENT */}
        {children}
      </body>
    </html>
  );
}

/** Simple inline styles to show spacing and color */
const styles: { [key: string]: React.CSSProperties } = {
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
};
