"use client";

import React from "react";
import Link from "next/link";

// NOTE: Add your custom CSS for the dark style, or rely on globals.css.
export default function Home() {
  return (
    <main>
      {/* HERO / TOP SECTION */}
      <section
        style={{
          padding: "4rem 1rem",
          textAlign: "center",
          backgroundColor: "#1a1a1a",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            The Ultimate IQ Tester
          </h1>

          {/* Images section */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
            }}
          >
            <img
              src="/albert.jpg" 
              alt="Albert Einstein"
              style={{
                width: "300px",
                height: "auto",
                borderRadius: "8px",
              }}
            />
            <img
              src="/tesla.jpeg"
              alt="Nikola Tesla"
              style={{
                width: "300px",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </div>

          <p style={{ marginBottom: "2rem" }}>
            Our IQ tester dynamically adjusts the difficulty of the questions
            to the level of each test taker. Discover your own IQ or assess
            the intelligence of others.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link
              href="/start"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Test Yourself
            </Link>
          </div>

          {/* Stats row (1K, 3K, 2.9M, 92.8%) */}
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <StatItem label="Tests taken today" value="1K+" />
            <StatItem label="Tests taken in Cyprus" value="3K+" />
            <StatItem label="Total tests taken" value="2.9M+" />
            <StatItem label="Results rated as accurate" value="92.8%" />
          </div>
        </div>
      </section>

      {/* AVERAGE IQ PER COUNTRY / STUDY / OCCUPATION */}
      <section
        style={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              justifyContent: "space-between",
            }}
          >
            {/* Country */}
            <div style={{ flex: "1 1 300px" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                Average IQ per country
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li>South Korea — Average IQ: 118</li>
                <li>Taiwan — Average IQ: 113</li>
                <li>Germany — Average IQ: 113</li>
                <li>China — Average IQ: 112</li>
                <li>Switzerland — Average IQ: 112</li>
              </ul>
            </div>

            {/* Study */}
            <div style={{ flex: "1 1 300px" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                Average IQ per Study
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li>Theoretical Physics — Avg IQ: 115</li>
                <li>Molecular Biology — Avg IQ: 114</li>
                <li>Engineering Physics — Avg IQ: 113</li>
                <li>Aerospace Engineering — Avg IQ: 110</li>
                <li>Biomedical Engineering — Avg IQ: 110</li>
              </ul>
            </div>

            {/* Occupation */}
            <div style={{ flex: "1 1 300px" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                Average IQ per occupation
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li>Structural Engineer — Avg IQ: 114</li>
                <li>Software Engineer — Avg IQ: 113</li>
                <li>Family Physician — Avg IQ: 111</li>
                <li>Software Intern — Avg IQ: 111</li>
                <li>Product Manager — Avg IQ: 110</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Uncover your True Potential */}
      <section
        style={{
          textAlign: "center",
          backgroundColor: "#1a1a1a",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h3
            style={{
              fontSize: "1.5rem",
              marginBottom: "2rem",
              color: "var(--color-accent)",
            }}
          >
            Uncover your True Potential
          </h3>

          {/* Rows / images for the bullet points */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
            <div style={{ flex: "1 1 300px", textAlign: "left" }}>
              {/* PLACE AN ILLUSTRATION HERE (the "IQ test that adapts" icon) */}
              <h4 style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                The IQ test that adapts to your level
              </h4>
              <p>
                The Brght IQ test dynamically adapts to your intelligence
                level. After each question, it estimates your IQ and selects
                the next question accordingly. This ensures each question is
                challenging yet solvable for everyone, providing a shorter and
                more accurate test.
              </p>
            </div>
            <div style={{ flex: "1 1 300px", textAlign: "left" }}>
              {/* PLACE AN ILLUSTRATION HERE (the "Compare IQ" icon) */}
              <h4 style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                Compare your IQ to your peers
              </h4>
              <p>
                After completing the test, you'll receive a detailed report
                breaking down your IQ and highlighting your strengths in
                logical, numerical, and spatial reasoning. Use this report to
                benchmark your score against people holding your dream job,
                attending your target university, or living in your city.
              </p>
            </div>
            <div style={{ flex: "1 1 300px", textAlign: "left" }}>
              {/* PLACE AN ILLUSTRATION HERE (the "Retake test" icon) */}
              <h4 style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                Retake the test as often as needed
              </h4>
              <p>
                Didn't perform at your best due to nerves or a poor night's
                sleep? Don't worry — you can retake the test as many times as
                needed to achieve your optimal result. With thousands of items
                in our database, each test you take will be unique.
              </p>
            </div>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link
              href="/start"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Find out your IQ score
            </Link>
          </div>
        </div>
      </section>

      {/* The most accurate IQ test... */}
      <section
        style={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "2rem 1rem",
          textAlign: "left",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h4
            style={{
              marginBottom: "1rem",
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}
          >
            The most accurate IQ test, for a fraction of the costs
          </h4>
          <p style={{ marginBottom: "1rem" }}>
            The BRGHT IQ test is the most innovative cognitive ability
            measurement, harnessing the power of the advanced 2PL IRT
            (Two-Parameter Logistic Item Response Theory) model into the first
            adaptive IQ test. This methodology offers unparalleled accuracy by
            considering both the difficulty of questions and the likelihood of
            a correct response.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            With a diverse pool of over 2 million participants, each question
            has undergone meticulous refinement based on responses from those
            with similar IQ levels. Such a vast data set provides several
            advantages:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <b>Granular Calibration:</b> The extensive pool of participants
              ensures that each question is calibrated to a wide range of
              cognitive abilities, ensuring a more tailored testing
              experience.
            </li>
            <li>
              <b>Broad Representativity:</b> It ensures that the test remains
              unbiased, culturally sensitive, and widely applicable to varied
              backgrounds.
            </li>
            <li>
              <b>Data-driven Precision:</b> The immense volume of responses
              allows the test to focus on the most discerning questions,
              significantly minimizing measurement error.
            </li>
          </ul>
          <p style={{ marginBottom: "2rem" }}>
            In comparison to traditional one-size-fits-all IQ tests, BRGHT's
            approach ensures more precise and efficient results. While classic
            tests can be prohibitively expensive, the BRGHT IQ test offers
            unlimited testing with its comprehensive, data-backed results
            starting at only $19.95.
          </p>
          <div style={{ textAlign: "center" }}>
            <Link
              href="/start"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Take the test
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: "#1a1a1a",
          color: "#fff",
          padding: "1rem",
          marginTop: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Footer Logo? Optional */}
            <h4 style={{ margin: 0 }}>IQ Tester</h4>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/privacy" style={{ color: "#fff", textDecoration: "none" }}>
              Privacy
            </Link>
            <Link
              href="/terms-and-conditions"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Terms and conditions
            </Link>
            <Link href="/data-request" style={{ color: "#fff", textDecoration: "none" }}>
              Research
            </Link>
            <Link href="/method" style={{ color: "#fff", textDecoration: "none" }}>
              Method
            </Link>
            <Link href="/contact" style={{ color: "#fff", textDecoration: "none" }}>
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/**
 * Simple stat item component for the hero stats row
 */
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: "#333",
        borderRadius: "8px",
        padding: "1rem",
        textAlign: "center",
        minWidth: "120px",
      }}
    >
      <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "0.9rem", color: "#ccc" }}>{label}</div>
    </div>
  );
}