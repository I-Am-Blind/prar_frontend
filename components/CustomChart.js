import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

export default function CustomRechart({ data, labels }) {
  // Prepare the data format for Recharts
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const formattedData = data.map((value, index) => ({
      date: labels[index], 
      value : value?value:0,
    }));

    setChartData(formattedData);
  }, [data, labels]);

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


  const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
  
    if (value > 150) {
      return (
        <circle cx={cx} cy={cy} r={3} stroke={stroke} fill="#F21B1B" />
      );
    }
  
    return (
      <circle cx={cx} cy={cy} r={3} stroke={stroke} fill="#6ACA79" />
    );
  };


  return (
    <div className="w-full h-full ">
      <ResponsiveContainer>
        <LineChart
          data={chartData}

        >
          <CartesianGrid  vertical={false} stroke="#F0F0F0"/>
            <XAxis
              dataKey="date"
              tickFormatter={(timeStr) => moment(timeStr).format("MMM D")}
              tick={{ fontSize: 13, fill: 'black', fontWeight:'600' }} 
              tickMargin={15}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
            tick={{ fontSize: 13, fill: 'black', fontWeight:'600' }} 
            tickMargin={15}
            axisLine={false}
            tickLine={false}
            domain={[0, 20]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#e8eef0"
              dot={<CustomizedDot />}
            />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
