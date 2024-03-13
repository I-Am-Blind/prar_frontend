import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { GetReadings } from "@/Database/Sensors";

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

const CustomizedDot = ({ cx, cy, stroke, payload, value }) => {
  if (value > 150) {
    return (
      <circle cx={cx} cy={cy} r={3} stroke={stroke} fill="#F21B1B" />
    );
  }
  return (
    <circle cx={cx} cy={cy} r={3} stroke={stroke} fill="#6ACA79" />
  );
};

const SensorChart = ({ sensorType }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const readingsData = await GetReadings(sensorType);
      const readings = readingsData[sensorType];
      const formattedData = readings.map(reading => {
        const timestamp = moment(reading.timestamp, "MMM DD, YYYY at h:mm:ss A Z").valueOf();
        if (sensorType !== "bp") {
          return { timestamp, value: reading.readings };
        } else {
          const [systolic, diastolic] = reading.readings.split("/").map(value => parseInt(value, 10));
          return { timestamp, systolic, diastolic };
        }
      });
      setData(formattedData);
    }
    fetchData();
  }, [sensorType]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} stroke="#F0F0F0" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timeStr) => moment(timeStr).format("MMM D")}
          tick={{ fontSize: 13, fill: 'black', fontWeight: '600' }} 
          tickMargin={15}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 13, fill: 'black', fontWeight: '600' }} 
          tickMargin={15}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey={sensorType !== "bp" ? "value" : "systolic"}
          stroke="#e8eef0"
          dot={<CustomizedDot />}
        />
        {sensorType === "bp" && (
          <Line type="monotone" dataKey="diastolic" stroke="#2563eb" dot={<CustomizedDot />} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SensorChart;
