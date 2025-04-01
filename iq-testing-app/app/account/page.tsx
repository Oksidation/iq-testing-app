"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

type TestSession = {
  id: string;
  test_id: string;
  started_at: string | null;
  completed_at: string | null;
  score: number | null;
  created_at: string;
  tests: {
    title: string;
    description: string | null;
  } | null;
};

// Extended user profile type
type UserProfile = {
  id: string;
  email: string;
  credits?: number | null;
  created_at?: string | null;
  level_of_education?: string | null;
  job_title?: string | null;
  job_type?: string | null;
  industry?: string | null;
  gender?: string | null;
  country?: string | null;
};

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [testSessions, setTestSessions] = useState<TestSession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // 1) Check Supabase auth session
        const {
          data: { session },
          error: sessionError,
        } = await supabaseClient.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session) {
          router.replace("/login");
          return;
        }

        setUserEmail(session.user.email || "");

        // 2) Fetch user profile (including new columns)
        const { data: userData, error: userError } = await supabaseClient
          .from("users")
          .select(`
            id,
            email,
            credits,
            created_at,
            level_of_education,
            job_title,
            job_type,
            industry,
            gender,
            country
          `)
          .eq("id", session.user.id)
          .single();

        if (userError) throw userError;
        if (userData) {
          setUserProfile(userData as UserProfile);
        }

        // 3) Fetch user test sessions
        const { data: testData, error: testError } = await supabaseClient
          .from("user_test_sessions")
          .select(
            `
              id,
              test_id,
              started_at,
              completed_at,
              score,
              created_at,
              tests (
                title,
                description
              )
            `
          )
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (testError) throw testError;

        // Add type assertion to ensure the data matches our TestSession type
        const typedTestData = (testData || []) as unknown as TestSession[];
        setTestSessions(typedTestData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  async function handleLogout() {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.2)",
              borderTopColor: "var(--color-accent)",
              animation: "spin 1s linear infinite",
            }}
          />
          <p>Loading account data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "white",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "var(--color-accent)",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          My Account
        </h1>

        {/* User Info */}
        <div
          style={{
            marginBottom: "2rem",
            backgroundColor: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "var(--color-accent)",
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Welcome, {userEmail}
          </h2>

          {/* Additional userProfile details */}
          {userProfile && (
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ marginBottom: "0.25rem" }}>
                <strong>Level of Education:</strong>{" "}
                {userProfile.level_of_education || "Not provided"}
              </p>
              <p style={{ marginBottom: "0.25rem" }}>
                <strong>Job Title:</strong> {userProfile.job_title || "Not provided"}
              </p>
              <p style={{ marginBottom: "0.25rem" }}>
                <strong>Job Type:</strong> {userProfile.job_type || "Not provided"}
              </p>
              <p style={{ marginBottom: "0.25rem" }}>
                <strong>Industry:</strong> {userProfile.industry || "Not provided"}
              </p>
              <p style={{ marginBottom: "0.25rem" }}>
                <strong>Gender:</strong> {userProfile.gender || "Not provided"}
              </p>
              <p style={{ marginBottom: "0.25rem" }}>
                <strong>Country:</strong> {userProfile.country || "Not provided"}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "var(--color-accent)",
              color: "white",
              padding: "0.75rem 1.25rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "opacity 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Logout
          </button>
        </div>

        {/* Test Sessions History */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "var(--color-accent)",
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            My Test History
          </h2>

          {testSessions.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                color: "#aaa",
              }}
            >
              <p>
                You haven&apos;t taken any tests yet.{" "}
                <Link
                  href="/tests"
                  style={{
                    color: "var(--color-accent)",
                    textDecoration: "none",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                >
                  Take one now!
                </Link>
              </p>
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #333",
                    }}
                  >
                    <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>
                      Test
                    </th>
                    <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>
                      Started
                    </th>
                    <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>
                      Completed
                    </th>
                    <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>
                      Score
                    </th>
                    <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testSessions.map((session) => {
                    const isCompleted = Boolean(session.completed_at);
                    return (
                      <tr
                        key={session.id}
                        style={{
                          borderBottom: "1px solid #333",
                        }}
                      >
                        <td style={{ padding: "0.75rem 1rem" }}>
                          {session.tests?.title || "Untitled Test"}
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          {session.started_at
                            ? new Date(session.started_at).toLocaleString()
                            : "N/A"}
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          {session.completed_at
                            ? new Date(session.completed_at).toLocaleString()
                            : "Incomplete"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            fontWeight: session.score ? "bold" : "normal",
                            color: session.score ? "var(--color-accent)" : "#aaa",
                          }}
                        >
                          {session.score ?? "--"}
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          {isCompleted ? (
                            <Link
                              href={`/results/${session.id}`}
                              style={{
                                display: "inline-block",
                                backgroundColor: "transparent",
                                color: "var(--color-accent)",
                                padding: "0.75rem 1.25rem",
                                minWidth: "120px",
                                textAlign: "center",
                                borderRadius: "4px",
                                textDecoration: "none",
                                fontWeight: "bold",
                                border: "1px solid var(--color-accent)",
                                transition: "all 0.2s ease",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "var(--color-accent)";
                                e.currentTarget.style.color = "white";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                                e.currentTarget.style.color =
                                  "var(--color-accent)";
                              }}
                            >
                              View Results
                            </Link>
                          ) : (
                            <span style={{ color: "#888" }}>In Progress</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-block",
              color: "var(--color-accent)",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              border: "1px solid var(--color-accent)",
              borderRadius: "4px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-accent)";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-accent)";
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
