"use client";

import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto"; // Use 'chart.js/auto' for automatic element registration
import { GetReadings } from "@/Database/Sensors";
import "chartjs-adapter-moment";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import right_arrow from "@/public/assets/right_arrow_white.svg";
import left_arrow from "@/public/assets/left_small_arrow_black.svg";
import initiate_test from "@/public/assets/initiate_test.png";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Page({ params }) {
  const router = useRouter();
  const chartRef = useRef(null); // Ref for chart instance
  const [data, setData] = useState([]);

  const slugtourl = {
    bp: "bloodpressure",
    bg: "bloodglucose",
    sp: "heartrate",
    hr: "heartrate",
    t: "temperature",
  };

  useEffect(() => {
    async function getlastreadings() {
      const readingsData = await GetReadings(params.slug);
      const readings = readingsData[params.slug];
      const formattedData = readings.map(reading => {
        const timestamp = moment(reading.timestamp, "MMM DD, YYYY at h:mm:ss A Z").valueOf(); // Convert to a valueOf for Recharts
        if (params.slug !== "bp") {
          return { timestamp, value: reading.readings };
        } else {
          const [systolic, diastolic] = reading.readings.split("/").map(value => parseInt(value, 10));
          return { timestamp, systolic, diastolic };
        }
      });
      setData(formattedData);
    }

    getlastreadings();
  }, [params.slug]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <p className="label">{`Time: ${moment(label).format("lll")}`}</p>
          <p className="intro">{`Value: ${payload[0].value}`}</p>
          {payload[1] && (
            <p className="intro">{`Value: ${payload[1].value}`}</p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <main className="w-screen h-screen pt-10 px-4 flex flex-col gap-2 items-start bg-slate-50  ">
      <div className="flex justify-center items-center">
        <Image alt="initiate" src={left_arrow} className="w-6" />
        <h2 className="ml-4 text-lg capitalize font-semibold text-darkblue">
          {slugtourl[params.slug]}
        </h2>
      </div>
      <Button
        className="h-[7rem] w-52 flex flex-col gap-2 items-end bg-green1"
        onClick={() => {
          router.push("/dashboard/alltests/" + slugtourl[params.slug]);
        }}
      >
        <Image alt="initiate" src={initiate_test} className="w-10" />
        <div className="flex justify-between w-full">
          <span className="text-left">
            Initiate <br /> test{" "}
          </span>

          <Image alt="initiate" src={right_arrow} className="" />
        </div>
      </Button>
      <div className="w-full h-[23rem]  pt-0 rounded-xl shadow-lg p-4 shadow-gray-200 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timeStr) => moment(timeStr).format("MMM D")}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={params.slug !== "bp" ? "value" : "systolic"}
              stroke="#8884d8"
            />
            {params.slug === "bp" && (
              <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
