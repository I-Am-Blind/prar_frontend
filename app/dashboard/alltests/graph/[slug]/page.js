"use client";

import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto"; // Use 'chart.js/auto' for automatic element registration
import { GetReadings } from "@/Database/Sensors";
import "chartjs-adapter-moment";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const router = useRouter();
  const chartRef = useRef(null); // Ref for chart instance
  const chartContainerRef = useRef(null); // Ref for the canvas container

  const slugtourl = {
    bp : 'bloodpressure',
    bg : 'bloodglucose',
    sp : 'heartrate',
    hr : 'heartrate'
  }

  useEffect(() => {
    async function getlastreadings() {
      const readingsData = await GetReadings(params.slug);
      const readings = readingsData[params.slug];
      let labels = [];
      let data = [];
      let data1 = [];
      readings.forEach((reading) => {
        const timestamp = moment(
          reading.timestamp,
          "MMM DD, YYYY at h:mm:ss A Z"
        ).format("lll");
        labels.push(timestamp);
        if (params.slug !== "bp") data.push(reading.readings);
        else {
          const [systolic, diastolic] = reading.readings
            .split("/")
            .map((value) => parseInt(value, 10));

          if (typeof systolic === "number") data.push(systolic);
          if (typeof diastolic === "number") data1.push(diastolic);
        }
      });

      if (!chartContainerRef.current) return;

      const ctx = chartContainerRef.current.getContext("2d");
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the previous instance if it exists
      }

      let datasets;
      console.log(data, data1);
      if (params.slug !== "bp") {
        datasets = [
          {
            data: data, // Readings for the y-axis
            label: "Readings",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
        ];
      } else {
        datasets = [
          {
            data: data, // Readings for the y-axis
            label: "Systolic",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
          {
            data: data1, // Readings for the y-axis
            label: "Diastolic",
            borderColor: "#000000",
            backgroundColor: "#000000",
            fill: false,
          },
        ];
      }

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
                unit: "hour", // Display labels in hourly increments
                displayFormats: {
                  hour: "MMM D, hA", // Customize as needed (e.g., 'hA' for hourly labels like '3PM')
                },
              },
              ticks: {
                autoSkip: true, // Let Chart.js skip labels to prevent overlap
                maxRotation: 0, // Keep labels horizontal
                maxTicksLimit: 15, // Adjust based on the size of your chart
              },
            },
            y: {
              type: "linear",
              min: 0,
              max: 200,
              beginAtZero: true,
            },
          },
        },
      });
    }
    getlastreadings();
  }, [params.slug]);

  return (
    <main className="w-screen h-screen py-10 px-4 flex flex-col gap-4 justify-center items-center">
      <Button onClick={()=>{router.push('/dashboard/alltests/' + slugtourl[params.slug])}}>Initiate test</Button>
      <div className="w-[50rem] h-max border border-gray-400 pt-0 rounded-xl shadow-xl">
        <canvas id="myChart" ref={chartContainerRef}></canvas>
      </div>
    </main>
  );
}
