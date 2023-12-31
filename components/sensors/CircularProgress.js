import React, { useState, useEffect } from 'react';

const CircularProgress = ({ value, min = 0, max = 100, text='', unit, flag = true }) => {
  const [lastValidValue, setLastValidValue] = useState(value);
  const radius = 140;
  const bgstroke = 1;
  const valuestroke = 5;
  const normalizedRadius = radius - valuestroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;


  const progress = (lastValidValue - min) / (max - min);
  const strokeDashoffset = circumference - progress * circumference;


  useEffect(() => {
    if (typeof value === 'number' && value >= min && value <= max && !isNaN(value) && value !== 0) {
      setLastValidValue(value);
    }
  }, [value]);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="transform"
      >
        <circle
          stroke="#d1d5db"
          fill="transparent"
          strokeWidth={bgstroke}
          strokeDasharray={circumference + ' ' + circumference}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="rgb(22,190,20)"
          fill="transparent"
          strokeWidth={valuestroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
          className="transform -rotate-90 origin-center"
        />
      </svg>
      {/* Text and unit positioned over the SVG */}
      <div className="absolute flex flex-col items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
        <span className="font-bold text-5xl text-green-600" >{flag === true? lastValidValue : text}</span>
        <span className="text-xl text-gray-600">{unit}</span>
      </div>
    </div>
  );
};

export default CircularProgress;
