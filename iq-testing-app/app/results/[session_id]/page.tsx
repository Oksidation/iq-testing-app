"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import BellCurveChart from "@/components/BellCurveChart";
import CircularProgressBar from "@/components/CircularProgressBar";

function formatSecondsToMMSS(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function ResultsPage() {
  const router = useRouter();
  const { session_id } = useParams();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionData, setSessionData] = useState<any | null>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [fetchingUser, setFetchingUser] = useState(true);

  const IQ_TEST_ID = "00000000-0000-0000-0000-000000000001";

  const [answers, setAnswers] = useState<any[]>([]);
  const [answersLoading, setAnswersLoading] = useState(true);

  // Add userId to the component's state
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrorMsg("");

      try {
        if (!session_id) {
          throw new Error("No session_id provided in URL");
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabaseClient.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session) {
          throw new Error("You must be logged in to view this page.");
        }

        const userId = session.user.id;
        setUserId(userId);

        const { data: userData, error: userError } = await supabaseClient
          .from("users")
          .select("credits")
          .eq("id", userId)
          .single();

        if (userError) throw userError;
        if (!userData) {
          throw new Error("User record not found.");
        }

        setUserCredits(userData.credits || 0);
        setFetchingUser(false);

        const { data: sessData, error: sessError } = await supabaseClient
          .from("user_test_sessions")
          .select(`
            test_id,
            score,
            advanced_report_redeemed,
            advanced_report_redeemed_at,
            score_numerical,
            score_logical,
            score_spatial,
            started_at
          `)
          .eq("id", session_id)
          .single();

        if (sessError) throw sessError;
        if (!sessData) {
          throw new Error("No session found for that ID");
        }

        setSessionData(sessData);

        if (sessData) {
          const { data: answersRows, error: answersError } = await supabaseClient
            .from("user_answers")
            .select(`
              id,
              question_id,
              selected_option,
              created_at,
              questions!inner (
                question_text,
                correct_option,
                category
              )
            `)
            .eq("session_id", session_id);

          if (answersError) throw answersError;
          setAnswers(answersRows || []);
          setAnswersLoading(false);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setErrorMsg(err.message || "Unable to fetch session data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session_id]);

  async function handleUnlockReport() {
    try {
      if (!sessionData) return;
      if (userCredits < 1) {
        alert("You have no credits left.");
        return;
      }

      setLoading(true);

      const {
        data: userUpdateData,
        error: userUpdateError,
      } = await supabaseClient
        .from("users")
        .update({ credits: userCredits - 1 })
        .eq("id", (await supabaseClient.auth.getSession()).data.session?.user.id)
        .select()
        .single();

      if (userUpdateError) {
        throw userUpdateError;
      }

      const { error: sessionUpdateError } = await supabaseClient
        .from("user_test_sessions")
        .update({
          advanced_report_redeemed: true,
          advanced_report_redeemed_at: new Date(),
        })
        .eq("id", session_id);

      if (sessionUpdateError) {
        throw sessionUpdateError;
      }

      router.push(`/results/${session_id}/loading`);
      
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to unlock advanced report.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
          color: "#fff",
        }}>
        <p>Loading...</p>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
          color: "#fff",
          padding: "2rem",
        }}>
        <div style={{
            maxWidth: "400px",
            backgroundColor: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            textAlign: "center",
          }}>
          <h2 style={{ color: "var(--color-accent)", marginBottom: "1rem" }}>
            Error
          </h2>
          <p style={{ marginBottom: "1rem" }}>{errorMsg}</p>
          <button onClick={() => (window.location.href = "/account")}
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#fff",
              padding: "0.75rem 1.25rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}>
            Back to Account
          </button>
        </div>
      </main>
    );
  }

  if (!sessionData.advanced_report_redeemed) {
    return (
      <main style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
          color: "#fff",
          padding: "2rem",
        }}>
        <div style={{
            maxWidth: "500px",
            backgroundColor: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            textAlign: "center",
          }}>
          <h2 style={{ color: "var(--color-accent)", marginBottom: "1rem" }}>
            Advanced Report Not Redeemed
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            You have not redeemed a credit for the advanced report of this test.
          </p>

          {fetchingUser ? (
            <p>Checking your credits...</p>
          ) : userCredits > 0 ? (
            <button onClick={handleUnlockReport}
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
                padding: "0.75rem 1.25rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}>
              Unlock Advanced Report (You have {userCredits} credit{userCredits === 1 ? "" : "s"})
            </button>
          ) : (
            <div style={{ marginTop: "1rem" }}>
              <p>You have 0 credits. Purchase more to unlock the advanced report.</p>
              <button onClick={() =>
                  window.open(
                    `https://buy.stripe.com/cN2dTo1p051zfZKfZs?client_reference_id=${session_id}`,
                    "_blank"
                  )
                }
                style={{
                  marginTop: "1rem",
                  backgroundColor: "var(--color-accent)",
                  color: "#fff",
                  padding: "0.75rem 1.25rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}>
                Buy Unlock Credit
              </button>
            </div>
          )}

          <button onClick={() => (window.location.href = "/account")}
            style={{
              marginTop: "1.5rem",
              backgroundColor: "transparent",
              color: "var(--color-accent)",
              padding: "0.75rem 1.25rem",
              border: "1px solid var(--color-accent)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}>
            Back to Account
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
        padding: "2rem",
      }}>
      <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#1a1a1a",
          padding: "2rem",
          borderRadius: "8px",
        }}>
        <h1 style={{
            color: "var(--color-accent)",
            marginBottom: "1rem",
            fontSize: "1.5rem",
            textAlign: "center",
          }}>
          Results Page (Advanced)
        </h1>

        {sessionData.test_id === IQ_TEST_ID ? (
          <IQAdvancedSection
            score={sessionData.score}
            score_numerical={sessionData.score_numerical}
            score_logical={sessionData.score_logical}
            score_spatial={sessionData.score_spatial}
          />
        ) : (
          <GenericAdvancedSection />
        )}

        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "var(--color-accent)", marginBottom: "1rem" }}>
            Detailed Answer Analysis
          </h2>
          {answersLoading ? (
            <p>Loading answers...</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>#</th>
                  <th style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>Question</th>
                  <th style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>Category</th>
                  <th style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>Your Answer</th>
                  <th style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>Correct?</th>
                  <th style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {answers.map((ans, index) => {
                  const isCorrect = ans.selected_option === ans.questions.correct_option;
                  let timeUsedStr = "";
                  if (sessionData.started_at && ans.created_at) {
                    const start = new Date(sessionData.started_at).getTime();
                    const answered = new Date(ans.created_at).getTime();
                    const diffSec = Math.floor((answered - start) / 1000);
                    timeUsedStr = formatSecondsToMMSS(diffSec);
                  }
                  return (
                    <tr key={ans.id}>
                      <td style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>{index + 1}</td>
                      <td style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>{ans.questions.question_text}</td>
                      <td style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>{ans.questions.category || "N/A"}</td>
                      <td style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>{ans.selected_option}</td>
                      <td style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>
                        <span style={{ color: isCorrect ? "#4CAF50" : "#f44336" }}>
                          {isCorrect ? "✓" : "✗"}
                        </span>
                      </td>
                      <td style={{ borderBottom: "1px solid #333", padding: "0.5rem" }}>
                        {timeUsedStr || "--:--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <button onClick={() => (window.location.href = "/account")}
          style={{
            marginTop: "2rem",
            backgroundColor: "var(--color-accent)",
            color: "#fff",
            padding: "0.75rem 1.25rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}>
          Back to Account
        </button>
      </div>
    </main>
  );
}

function IQAdvancedSection({ score, score_numerical, score_logical, score_spatial, }: { score: number; score_numerical?: number; score_logical?: number; score_spatial?: number; }) {
  return (
    <div style={{ lineHeight: 1.6 }}>
      <h2 style={{ marginBottom: "1rem" }}>Detailed IQ Analysis</h2>
      <p>
        Overall IQ:{" "}
        <span style={{ fontWeight: "bold", color: "var(--color-accent)" }}>
          {score ?? "N/A"}
        </span>
      </p>
      <div style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          marginTop: "1.5rem",
          justifyContent: "center",
        }}>
        <CircularProgressBar percentage={score_logical ?? 0} label="Logical Reasoning" />
        <CircularProgressBar percentage={score_numerical ?? 0} label="Numerical Reasoning" />
        <CircularProgressBar percentage={score_spatial ?? 0} label="Spatial Reasoning" />
      </div>
      <div style={{ margin: "1.5rem 0" }}>
        <BellCurveChart userIQ={score} />
      </div>
      <p style={{ marginBottom: "0.5rem" }}>
        <strong>Note:</strong> IQ tests primarily measure certain cognitive skills, and there are many other forms of intelligence not reflected here.
      </p>
    </div>
  );
}

function GenericAdvancedSection() {
  return (
    <div style={{ lineHeight: 1.6 }}>
      <h2 style={{ marginBottom: "1rem" }}>Advanced Report (Generic)</h2>
      <p style={{ marginBottom: "1rem" }}>
        This is a placeholder for advanced analysis for non-IQ tests.
      </p>
    </div>
  );
}
