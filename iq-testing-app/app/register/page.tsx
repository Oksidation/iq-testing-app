"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

type CustomError = {
  message: string;
};

export default function RegisterPage() {
  const router = useRouter();

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 fields
  const [levelOfEducation, setLevelOfEducation] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [industry, setIndustry] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");

  // Shared states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Track multi-step
  const [step, setStep] = useState<1 | 2>(1);

  // Store the newly created user ID from Step 1
  const [newUserId, setNewUserId] = useState<string | null>(null);

  async function handleRegisterStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Step 1: Call Supabase Auth to register the user
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.user) {
        const userId = data.user.id;
        // Insert minimal record in your custom `users` table
        const { error: insertError } = await supabaseClient.from("users").insert([
          {
            id: userId,
            email: data.user.email,
            created_at: new Date().toISOString(),
            // Only minimal fields for now
          },
        ]);

        if (insertError) {
          console.error("Error inserting user:", insertError);
          setErrorMsg(
            "Account created, but there was an issue setting up your profile."
          );
        } else {
          // Move to Step 2
          setNewUserId(userId);
          setStep(2);
        }
      }
    } catch (err: CustomError) {
      setErrorMsg(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterStep2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (!newUserId) {
        // Safety check – ideally shouldn't happen if step 1 succeeded
        setErrorMsg("User ID missing. Please restart registration.");
        return;
      }

      // Step 2: Update the users table with additional fields
      const { error: updateError } = await supabaseClient
        .from("users")
        .update({
          level_of_education: levelOfEducation,
          job_title: jobTitle,
          job_type: jobType,
          industry,
          gender,
          country,
        })
        .eq("id", newUserId);

      if (updateError) {
        console.error("Error updating user details:", updateError);
        setErrorMsg(
          "Your account was created, but we couldn't save additional details."
        );
      } else {
        alert("Registration successful! Check your email for confirmation.");
        // Redirect to login or home
        router.push("/login");
      }
    } catch (err: CustomError) {
      setErrorMsg(err.message || "An error occurred while updating profile details");
    } finally {
      setLoading(false);
    }
  }

  // Step 1 form: Email & Password
  const Step1Form = (
    <form
      onSubmit={handleRegisterStep1}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
      }}
    >
      <label style={{ marginBottom: "0.5rem" }}>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      />

      <label style={{ marginBottom: "0.5rem" }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          padding: "0.5rem",
          marginBottom: "1.5rem",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: "var(--color-accent)",
          color: "#fff",
          padding: "0.75rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        {loading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );

  // Step 2 form: Additional fields
  const Step2Form = (
    <form
      onSubmit={handleRegisterStep2}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
      }}
    >
      <label style={{ marginBottom: "0.5rem" }}>Level of Education</label>
      <input
        type="text"
        value={levelOfEducation}
        onChange={(e) => setLevelOfEducation(e.target.value)}
        placeholder="e.g. Bachelor's, Master's, etc."
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      />

      <label style={{ marginBottom: "0.5rem" }}>Job Title</label>
      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="e.g. Software Engineer"
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      />

      <label style={{ marginBottom: "0.5rem" }}>Job Type</label>
      <input
        type="text"
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        placeholder="e.g. Full-time, Part-time, Freelance"
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      />

      <label style={{ marginBottom: "0.5rem" }}>Industry</label>
      <input
        type="text"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        placeholder="e.g. Tech, Healthcare, Finance"
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      />

      <label style={{ marginBottom: "0.5rem" }}>Gender</label>
      <input
        type="text"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        placeholder="e.g. Male, Female, Non-binary"
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      />

      <label style={{ marginBottom: "0.5rem" }}>Country</label>
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="e.g. United States, Canada, etc."
        style={{
          padding: "0.5rem",
          marginBottom: "1.5rem",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: "var(--color-accent)",
          color: "#fff",
          padding: "0.75rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        {loading ? "Saving..." : "Finish Registration"}
      </button>
    </form>
  );

  return (
    <main className="container" style={{ padding: "2rem" }}>
      <h1 style={{ color: "var(--color-accent)", marginBottom: "1rem" }}>
        Register
      </h1>

      {errorMsg && (
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
          {errorMsg}
        </div>
      )}

      {step === 1 ? Step1Form : Step2Form}

      {step === 1 && (
        <p style={{ marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--color-accent)" }}>
            Login
          </Link>
        </p>
      )}
    </main>
  );
}
