"use client";

import { useRouter, useParams } from "next/navigation";

export default function TestInstructionsPage() {
  const router = useRouter();
  const params = useParams();
  // If your route is [testId], destructure accordingly:
  const testId = params.testId || params.testIds;

  function handleStart() {
    // This sends the user to the actual test detail page,
    // which creates the session & displays questions:
    router.push(`/tests/${testId}`);
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "#121212",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          backgroundColor: "#1a1a1a",
          padding: "2rem",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "var(--color-accent)",
            marginBottom: "1rem",
            fontSize: "1.5rem",
          }}
        >
          Test Instructions
        </h1>

        <p style={{ marginBottom: "1rem", lineHeight: 1.5 }}>
          Each question in this test is timed (90 seconds). Once the timer ends,
          you will automatically move to the next question. If you leave the test
          window, switch tabs, minimize the browser, or open another app, you will
          be disqualified immediately.
        </p>

        <p style={{ marginBottom: "1.5rem", lineHeight: 1.5 }}>
          Please ensure you have a stable internet connection and are ready to focus
          exclusively on this test. Good luck!
        </p>

        <button
          onClick={handleStart}
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
          I Understand
        </button>
      </div>
    </main>
  );
}
