"use client";
import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";

// Register Chart.js components & annotation plugin once at module level.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

/** Probability density function for normal distribution */
function normalPdf(x: number, mean: number, sd: number) {
  const exponent = -0.5 * ((x - mean) / sd) ** 2;
  const base = 1 / (sd * Math.sqrt(2 * Math.PI));
  return base * Math.exp(exponent);
}

/** Generate data points for a bell curve from x=60..140 */
function generateBellCurveData(mean: number, sd: number) {
  const dataPoints = [];
  for (let x = 60; x <= 140; x++) {
    dataPoints.push({ x, y: normalPdf(x, mean, sd) });
  }
  return dataPoints;
}

type ChartDataType = ChartData<'line', { x: number; y: number }[]>;
type ChartOptionsType = ChartOptions<'line'>;

export default function BellCurveChart({ userIQ }: { userIQ: number }) {
  // Memoize chart configuration so it only recalculates when userIQ changes.
  const { data, options } = useMemo(() => {
    const mean = 100;
    const sd = 15;
    const points = generateBellCurveData(mean, sd);

    const data: ChartDataType = {
      datasets: [
        {
          label: "IQ Normal Distribution",
          data: points,
          borderColor: "#34eb9b",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          parsing: false,
        },
      ],
    };

    const options: ChartOptionsType = {
      responsive: true,
      scales: {
        x: {
          type: "linear",
          min: 60,
          max: 140,
          title: { display: true, text: "IQ Score" },
        },
        y: {
          type: "linear",
          title: { display: true, text: "Probability" },
          ticks: { display: false },
        },
      },
      plugins: {
        annotation: {
          annotations: {
            userIQLine: {
              type: "line",
              xMin: userIQ,
              xMax: userIQ,
              borderColor: "red",
              borderWidth: 2,
              label: {
                enabled: true,
                content: `Your IQ: ${userIQ}`,
                position: "end",
                backgroundColor: "rgba(255,0,0,0.8)",
                color: "#fff",
              },
            },
          },
        },
        legend: {
          display: false,
        },
      },
    };

    return { data, options };
  }, [userIQ]);

  return (
    <Line data={data} options={options} style={{ maxHeight: 300, width: "100%" }} />
  );
}
