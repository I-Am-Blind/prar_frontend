"use client";

import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto"; // Use 'chart.js/auto' for automatic element registration
import "chartjs-adapter-moment";

export default function CustomChart({ data, labels }) {
  const chartRef = useRef(null); // Ref for chart instance
  const chartContainerRef = useRef(null); // Ref for the canvas container

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const ctx = chartContainerRef.current.getContext("2d");
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy the previous instance if it exists
    }
   console.log(data,labels)
    const datasets = [
      {
        data: data, // Readings for the y-axis
        label: "Health Score",
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        fill: false,
      },
    ];

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels, // Formatted timestamps for the x-axis
        datasets: datasets,
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              parser: "lll", // Adjust if necessary to match the input format
              tooltipFormat: "ll HH:mm", // Display hours and minutes in tooltip
              unit: "day", // Display labels in hourly increments
              displayFormats: {
                hour: "MMM D, hA", // Customize as needed (e.g., 'hA' for hourly labels like '3PM')
              },
            },
            ticks: {
              autoSkip: true, // Let Chart.js skip labels to prevent overlap
              maxRotation: 0, // Keep labels horizontal
              maxTicksLimit: 5 // Adjust based on the size of your chart
            },
          },
          y: {
            type: "linear",
            min: 0,
            max: 20,
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (
    <div className="w-full h-full border border-gray-400 pt-0 rounded-xl shadow-xl p-4">
      <canvas id="myChart" ref={chartContainerRef}></canvas>
    </div>
  );
}
