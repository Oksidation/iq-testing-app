import React from "react";

interface CircularProgressBarProps {
  percentage: number; // e.g. 62
  label?: string;     // e.g. "Logical Reasoning"
  size?: number;      // diameter in px (optional, default 100)
  strokeWidth?: number; // stroke width (optional, default 10)
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  label = "",
  size = 100,
  strokeWidth = 10,
}) => {
  // Ensure we clamp percentage between 0 and 100 just in case
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);

  // SVG circle specifics
  const radius = (size - strokeWidth) / 2; // radius of the circle
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (normalizedPercentage / 100) * circumference;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        width: size,
      }}
    >
      {/* SVG container */}
      <svg width={size} height={size}>
        {/* Background circle (track) */}
        <circle
          stroke="#2e2e2e" // a dark gray track
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke="var(--color-accent)" // or any accent color
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" // smooth edges
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        {/* Centered text (the percentage) */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="#fff"
          fontSize="1rem"
          fontWeight="bold"
        >
          {normalizedPercentage}%
        </text>
      </svg>
      {/* Optional label below the ring */}
      {label && (
        <span style={{ fontSize: "0.9rem", color: "#fff" }}>{label}</span>
      )}
    </div>
  );
};

export default CircularProgressBar;
