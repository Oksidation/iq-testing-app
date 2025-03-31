"use client";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";

// Register Chart.js components & annotation plugin
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
    const y = normalPdf(x, mean, sd);
    dataPoints.push({ x, y }); // important: return objects { x, y }
  }
  return dataPoints;
}

export default function BellCurveChart({ userIQ }: { userIQ: number }) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const mean = 100;
    const sd = 15;
    const points = generateBellCurveData(mean, sd);

    const data = {
      // We pass the entire { x, y } array to the dataset:
      datasets: [
        {
          label: "IQ Normal Distribution",
          data: points,
          borderColor: "#34eb9b",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          parsing: false, // Tell Chart.js we're providing explicit x/y
        },
      ],
    };

    const options: any = {
      responsive: true,
      scales: {
        x: {
          type: "linear", // numeric axis
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

    setChartData({ data, options });
  }, [userIQ]);

  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  return (
    <Line
      data={chartData.data}
      options={chartData.options}
      style={{ maxHeight: 300, width: "100%" }}
    />
  );
}
