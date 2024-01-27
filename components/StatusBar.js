import React, { useState, useEffect } from 'react';
import moment from 'moment'; // Import moment

const StatusBar = () => {
  const [dateTime, setDateTime] = useState(moment()); // Initialize with moment

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(moment()); // Update time using moment
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-screen justify-end flex fixed top-0 right-0 left-0 bg-lightblack text-white gap-2 px-4 text-xs h-8 items-center font-bold">
      <span>{dateTime.format('hh:mm A')}</span>
    </div>
  );
};

export default StatusBar;
