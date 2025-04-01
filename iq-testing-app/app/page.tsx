"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
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
            {/* Container for the first image */}
            <div
              style={{
                position: "relative",
                width: "300px",
                height: "200px",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Image
                src="/albert.jpg"
                alt="Albert Einstein"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            {/* Container for the second image */}
            <div
              style={{
                position: "relative",
                width: "300px",
                height: "200px",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Image
                src="/tesla.jpeg"
                alt="Nikola Tesla"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>

          <p style={{ marginBottom: "2rem" }}>
            Our IQ tester dynamically adjusts the difficulty of the questions to
            the level of each test taker. Discover your own IQ or assess the
            intelligence of others.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
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

      {/* ... rest of your content ... */}

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
            <Link
              href="/data-request"
              style={{ color: "#fff", textDecoration: "none" }}
            >
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
