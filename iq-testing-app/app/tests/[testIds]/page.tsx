"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

// First, add these type definitions at the top of your file
type CategoryTotals = {
  numerical: { correct: number; total: number };
  logical: { correct: number; total: number };
  spatial: { correct: number; total: number };
};

// Add these types after the imports
type Question = {
  id: string;
  testid: string;
  question_text: string;
  question_img_url?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  option_e?: string;
  option_a_img_url?: string;
  option_b_img_url?: string;
  option_c_img_url?: string;
  option_d_img_url?: string;
  option_e_img_url?: string;
  correct_option: string;
  category?: string;
};

type ApiError = {
  message: string;
};

export default function TestDetailPage() {
  console.log("[TestDetailPage] Component is mounting...");
  console.log("[TestDetailPage] Params:", useParams());

  const router = useRouter();
  const params = useParams();
  const { testIds } = params;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testFailed, setTestFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track which question we're currently on
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(90);

  // Failure notification
  const [showFailureNotification, setShowFailureNotification] = useState(false);
  const [failureReason, setFailureReason] = useState("");

  useEffect(() => {
    if (!testIds) return;

    async function initSession() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { session },
          error: authError,
        } = await supabaseClient.auth.getSession();
        if (authError) throw authError;

        if (!session) {
          router.replace("/login");
          return;
        }

        const { data: newSession, error: sessionError } = await supabaseClient
          .from("user_test_sessions")
          .insert({
            user_id: session.user.id,
            test_id: testIds,
            started_at: new Date(),
            test_status: "in_progress",
          })
          .select()
          .single();
        if (sessionError) throw sessionError;

        setSessionId(newSession.id);

        const { data: qs, error: qsError } = await supabaseClient
          .from("questions")
          .select("*")
          .eq("testid", testIds);

        if (qsError) throw qsError;

        setQuestions(qs || []);
      } catch (err: unknown) {
        console.error("Error initializing test session:", err);
        setError(
          err instanceof Error ? err.message : "An error occurred while starting the test"
        );
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, [testIds, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - move to next question or submit on last question
          if (currentQuestionIndex < questions.length - 1) {
            handleNextQuestion();
            return 90; 
          } else {
            handleSubmit();
            clearInterval(timer);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    // Reset timer on question change
    setTimeRemaining(90);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    function handleDisqualify() {
      if (!testFailed) {
        failTest();
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        handleDisqualify();
      }
    }

    function handleWindowBlur() {
      handleDisqualify();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [failTest, testFailed]);

  async function failTest() {
    if (testFailed || !sessionId) return;
    setTestFailed(true);

    let reason = "";
    if (document.visibilityState === "hidden") {
      reason = "You switched to another tab or minimized the window.";
    } else {
      reason = "You clicked outside the test window.";
    }
    setFailureReason(reason);
    setShowFailureNotification(true);

    await supabaseClient
      .from("user_test_sessions")
      .update({ test_status: "failed" })
      .eq("id", sessionId);
  }

  function handleSelectAnswer(questionId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  async function handleSubmit() {
    if (!sessionId || testFailed) return;
    setLoading(true);
    setError(null);

    try {
      // 1) Insert user answers (same as before)
      for (const q of questions) {
        await supabaseClient.from("user_answers").insert({
          session_id: sessionId,
          question_id: q.id,
          selected_option: answers[q.id] || null,
        });
      }

      let finalScore: number | null = null;

      // 2) ADHD TEST
      if (testIds === "79dfb445-08d3-4251-987b-b2c1c7d3b520") {
        let rawScore = 0;
        for (const q of questions) {
          const userAnswer = answers[q.id];
          if (userAnswer === "A") rawScore += 0;
          else if (userAnswer === "B") rawScore += 1;
          else if (userAnswer === "C") rawScore += 2;
          else if (userAnswer === "D") rawScore += 3;
        }

        const maxPossibleScore = questions.length * 3;
        const scorePercentage = rawScore / maxPossibleScore;
        const adhd_score = Math.round(scorePercentage * 20);
        finalScore = adhd_score;

        let likelihood = "unlikely";
        if (adhd_score >= 15) likelihood = "very likely";
        else if (adhd_score >= 10) likelihood = "likely";
        else if (adhd_score >= 5) likelihood = "possible";

        alert(`ADHD Test submitted! Your score: ${adhd_score}/20 (${likelihood})`);

        // Update user_test_sessions with ADHD final score
        const { error: adhdUpdateError } = await supabaseClient
          .from("user_test_sessions")
          .update({
            test_status: "completed",
            completed_at: new Date(),
            score: finalScore,
          })
          .eq("id", sessionId);

        if (adhdUpdateError) throw adhdUpdateError;
      }
      // 3) IQ TEST
      else if (testIds === "00000000-0000-0000-0000-000000000001") {
        // 3A) Track sub-scores for each category
        const categoryTotals: CategoryTotals = {
          numerical: { correct: 0, total: 0 },
          logical: { correct: 0, total: 0 },
          spatial: { correct: 0, total: 0 },
        };

        let overallCorrectCount = 0;
        for (const q of questions) {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correct_option;
          if (isCorrect) overallCorrectCount++;

          // Only apply sub-score logic for IQ test questions
          if (q.category === "numerical") {
            categoryTotals.numerical.total += 1;
            if (isCorrect) categoryTotals.numerical.correct += 1;
          } else if (q.category === "logical") {
            categoryTotals.logical.total += 1;
            if (isCorrect) categoryTotals.logical.correct += 1;
          } else if (q.category === "spatial") {
            categoryTotals.spatial.total += 1;
            if (isCorrect) categoryTotals.spatial.correct += 1;
          }
        }

        const total = questions.length;
        const approximateIQ = Math.floor(
          100 + ((overallCorrectCount / total) * 100 - 50)
        );
        finalScore = approximateIQ;

        // 3B) Compute sub-scores
        function computeCategoryIQ({ correct, total }: { correct: number; total: number }) {
          if (total === 0) return 0;
          const fractionCorrect = correct / total;
          return Math.floor(100 + (fractionCorrect * 100 - 50));
        }
        const iqNumerical = computeCategoryIQ(categoryTotals.numerical);
        const iqLogical = computeCategoryIQ(categoryTotals.logical);
        const iqSpatial = computeCategoryIQ(categoryTotals.spatial);

        alert(
          `IQ Test submitted!\n` +
          `Overall IQ: ${approximateIQ}\n` +
          `Numerical IQ: ${iqNumerical}\n` +
          `Logical IQ: ${iqLogical}\n` +
          `Spatial IQ: ${iqSpatial}`
        );

        // 3C) Update user_test_sessions with the overall score + sub-scores
        const { error: iqUpdateError } = await supabaseClient
          .from("user_test_sessions")
          .update({
            test_status: "completed",
            completed_at: new Date(),
            score: approximateIQ,
            score_numerical: iqNumerical,
            score_logical: iqLogical,
            score_spatial: iqSpatial,
          })
          .eq("id", sessionId);

        if (iqUpdateError) throw iqUpdateError;
      }
      // 4) Generic test handling
      else {
        let correctCount = 0;
        for (const q of questions) {
          if (answers[q.id] === q.correct_option) correctCount++;
        }
        finalScore = correctCount;
        alert(`Generic Test submitted! You got ${correctCount} correct.`);

        const { error: genericUpdateError } = await supabaseClient
          .from("user_test_sessions")
          .update({
            test_status: "completed",
            completed_at: new Date(),
            score: finalScore,
          })
          .eq("id", sessionId);

        if (genericUpdateError) throw genericUpdateError;
      }

      // 5) Finally, redirect to /account
      router.replace("/account");

    } catch (err: any) {
      console.error("Error submitting test:", err);
      setError(
        typeof err?.message === "string"
          ? err.message
          : "An error occurred while submitting the test"
      );
    } finally {
      setLoading(false);
    }
  }

  if (testFailed) {
    return (
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "var(--color-accent)",
              marginBottom: "1rem",
            }}
          >
            Test Failed
          </h2>
          <p style={{ color: "#fff", marginBottom: "1rem" }}>
            You have left the test window or switched tabs, causing this attempt
            to fail.
          </p>
          <button
            onClick={() => router.replace("/account")}
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#fff",
              padding: "0.75rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Go to Account
          </button>
        </div>
      </main>
    );
  }

  if (loading && questions.length === 0) {
    return (
      <main
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <p style={{ color: "#fff" }}>Loading...</p>
      </main>
    );
  }

  if (error || questions.length === 0) {
    return (
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {error ? (
            <div
              style={{
                backgroundColor: "#ff000015",
                border: "1px solid #ff000030",
                color: "#ff0000",
                padding: "0.75rem",
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          ) : (
            <p style={{ color: "#fff" }}>No questions found.</p>
          )}

          <button
            onClick={() => router.replace("/account")}
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#fff",
              padding: "0.75rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "1rem",
            }}
          >
            Go to Account
          </button>
        </div>
      </main>
    );
  }

  const q = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const FailureNotification = () => {
    if (!showFailureNotification) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            maxWidth: "500px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              color: "#ff4444",
              marginBottom: "1rem",
              fontSize: "1.5rem",
            }}
          >
            Test Failed
          </h2>
          <p style={{ color: "#fff", marginBottom: "1.5rem" }}>
            {failureReason}
          </p>
          <p style={{ color: "#aaa", marginBottom: "2rem", fontSize: "0.9rem" }}>
            To maintain test integrity, leaving the test window is not permitted.
            This attempt has been marked as failed.
          </p>
          <button
            onClick={() => {
              setShowFailureNotification(false);
              router.replace("/account");
            }}
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#1a1a1a",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <h1
          style={{
            color: "var(--color-accent)",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          IQ Test
        </h1>

        <div
          style={{
            width: "100%",
            backgroundColor: "#444",
            height: "8px",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              backgroundColor: "var(--color-accent)",
              height: "100%",
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: timeRemaining <= 10 ? "#ff4444" : "#fff",
            fontSize: "1.2rem",
            fontWeight: "bold",
            transition: "color 0.3s ease",
          }}
        >
          Time Remaining: {timeRemaining}s
        </div>

        <div
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            backgroundColor: "#333",
            borderRadius: "4px",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              marginBottom: "0.5rem",
              color: "var(--color-accent)",
            }}
          >
            {q.question_text}
          </p>

          {q.question_img_url && (
            <div style={{ marginBottom: "1rem" }}>
              <img
                src={q.question_img_url}
                alt="Question"
                style={{
                  maxWidth: "100%",
                  border: "1px solid #444",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}

          {/* Option A */}
          {q.option_a && (
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#fff",
              }}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                value="A"
                checked={answers[q.id] === "A"}
                onChange={() => handleSelectAnswer(q.id, "A")}
                disabled={loading}
              />
              <span style={{ marginLeft: "0.5rem" }}>{q.option_a}</span>
              {q.option_a_img_url && (
                <div style={{ marginTop: "0.5rem" }}>
                  <img
                    src={q.option_a_img_url}
                    alt="Option A"
                    style={{
                      maxWidth: "200px",
                      border: "1px solid #444",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
            </label>
          )}

          {/* Option B */}
          {q.option_b && (
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#fff",
              }}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                value="B"
                checked={answers[q.id] === "B"}
                onChange={() => handleSelectAnswer(q.id, "B")}
                disabled={loading}
              />
              <span style={{ marginLeft: "0.5rem" }}>{q.option_b}</span>
              {q.option_b_img_url && (
                <div style={{ marginTop: "0.5rem" }}>
                  <img
                    src={q.option_b_img_url}
                    alt="Option B"
                    style={{
                      maxWidth: "200px",
                      border: "1px solid #444",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
            </label>
          )}

          {/* Option C */}
          {q.option_c && (
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#fff",
              }}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                value="C"
                checked={answers[q.id] === "C"}
                onChange={() => handleSelectAnswer(q.id, "C")}
                disabled={loading}
              />
              <span style={{ marginLeft: "0.5rem" }}>{q.option_c}</span>
              {q.option_c_img_url && (
                <div style={{ marginTop: "0.5rem" }}>
                  <img
                    src={q.option_c_img_url}
                    alt="Option C"
                    style={{
                      maxWidth: "200px",
                      border: "1px solid #444",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
            </label>
          )}

          {/* Option D */}
          {q.option_d && (
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#fff",
              }}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                value="D"
                checked={answers[q.id] === "D"}
                onChange={() => handleSelectAnswer(q.id, "D")}
                disabled={loading}
              />
              <span style={{ marginLeft: "0.5rem" }}>{q.option_d}</span>
              {q.option_d_img_url && (
                <div style={{ marginTop: "0.5rem" }}>
                  <img
                    src={q.option_d_img_url}
                    alt="Option D"
                    style={{
                      maxWidth: "200px",
                      border: "1px solid #444",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
            </label>
          )}

          {/* Option E */}
          {q.option_e && (
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#fff",
              }}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                value="E"
                checked={answers[q.id] === "E"}
                onChange={() => handleSelectAnswer(q.id, "E")}
                disabled={loading}
              />
              <span style={{ marginLeft: "0.5rem" }}>{q.option_e}</span>
              {q.option_e_img_url && (
                <div style={{ marginTop: "0.5rem" }}>
                  <img
                    src={q.option_e_img_url}
                    alt="Option E"
                    style={{
                      maxWidth: "200px",
                      border: "1px solid #444",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
            </label>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNextQuestion}
              disabled={loading}
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
                padding: "0.75rem",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                flex: 1,
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || questions.length === 0}
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
                padding: "0.75rem",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                flex: 1,
              }}
            >
              {loading ? "Submitting..." : "Submit Test"}
            </button>
          )}
        </div>
      </div>
      <FailureNotification />
    </main>
  );
}
