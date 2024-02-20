"use client";

import { GetReadings } from "@/Database/Sensors";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import moment from "moment";

import arrow_left from "@/public/assets/left_small_arrow_blue.svg";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const [readings, setreadings] = useState([]);
  const [uniqueDates, setUniqueDates] = useState(new Set());
  const [filteredReadings, setFilteredReadings] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState({});
  // Assuming you're using functional components and hooks
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);

  const [selectedSensor, setSelectedSensor] = useState("allreadings");

  const sensorHeadings = {
    bp: "Blood Pressure",
    bg: "Blood Glucose",
    t: "Body Temperature",
    hr: "Heart Rate",
    sp: "Sp02",
  };

  const sensorunit = {
    bp: "mm/Hg",
    bg: "Mg/Dl",
    t: "°C",
    hr: "BPM",
    sp: "%",
  };

  useEffect(() => {
    async function getlastreadings() {
      const readings = await GetReadings();
      console.log(readings)
      setreadings(readings);
      extractUniqueDates(readings);
    }
    getlastreadings();
  }, []);

  function extractUniqueDates(readings) {
    let dates = new Set();
    let newStructuredReadings = {};

    Object.keys(readings).forEach((sensor) => {
      newStructuredReadings[sensor] = {};

      readings[sensor].forEach((reading) => {
        if (
          reading.readings === undefined ||
          reading.readings === "undefined" ||
          reading.readings === "undefined/undefined"
        )
          return;

        const formattedDate = moment(
          reading.timestamp,
          "MMM DD, YYYY at hh:mm:ss A Z"
        ).format("DD/MM/YY");
        const formattedTime = moment(
          reading.timestamp,
          "MMM DD, YYYY at hh:mm:ss A Z"
        ).format("h:mm A");
        dates.add(formattedDate);

        if (!newStructuredReadings[sensor][formattedDate]) {
          newStructuredReadings[sensor][formattedDate] = {};
        }

        if (!newStructuredReadings[sensor][formattedDate][formattedTime]) {
          newStructuredReadings[sensor][formattedDate][formattedTime] = [];
        }

        newStructuredReadings[sensor][formattedDate][formattedTime].push(
          reading
        );
      });
    });

    const sortedDates = Array.from(dates).sort();
    if (sortedDates.length > 0) {
      setSelectedDate(sortedDates[0]);

      const times =
        newStructuredReadings[Object.keys(newStructuredReadings)[0]][
          sortedDates[0]
        ];
      if (times) {
        const sortedTimes = Object.keys(times).sort();
        if (sortedTimes.length > 0) {
          setSelectedTime(sortedTimes[0]);
        }
      }
    }
    setUniqueDates(dates);
    setFilteredReadings(newStructuredReadings);
    console.log(readings, newStructuredReadings);
  }

  //
  const updateSelectedSensor = (sensorKey) => {
    setSelectedSensor(sensorKey);
  
    if (filteredReadings[sensorKey]) {
      const dates = Object.keys(filteredReadings[sensorKey]).sort();
      if (dates.length > 0) {
        const firstDate = dates[0];
        setSelectedDate(firstDate);
  
        const times = Object.keys(filteredReadings[sensorKey][firstDate]).sort();
        if (times.length > 0) {
          setSelectedTime(times[0]);
          setCurrentTimeIndex(0); // Reset the currentTimeIndex to 0
        } else {
          setSelectedTime("");
        }
      } else {
        setSelectedDate("");
        setSelectedTime("");
      }
    }
  };
  

  //

  //triggers
  function renderTabsTriggers() {
    return Object.keys(sensorHeadings).map((sensorKey) => (
      <TabsTrigger
        key={sensorKey}
        value={sensorKey}
        onClick={() => updateSelectedSensor(sensorKey)}
      >
        {sensorHeadings[sensorKey]}
      </TabsTrigger>
    ));
  }
  //

  //cards rendering
  function renderAllReadings() {
    if (!selectedDate || !filteredReadings) return null;

    let newStructure = {};
  let timestamps = new Set(); // Set to track unique timestamps

  Object.keys(filteredReadings).forEach((sensorType) => {
    const dates = filteredReadings[sensorType];
    const times = dates[selectedDate]; // Filter by selected date
    if (times) {
      Object.keys(times).forEach((time) => {
        if (!newStructure[time]) {
          newStructure[time] = [];
        }
        times[time].forEach((reading) => {
          const readingWithSensorType = { ...reading, sensorType };
          // Check if the timestamp is already processed
          if (!timestamps.has(reading.timestamp)) {
            timestamps.add(reading.timestamp);
            if (!newStructure[time].some((r) => r.id === reading.id)) {
              newStructure[time].push(readingWithSensorType);
            }
          }
        });
      });
    }
  });

  const timeKeys = Object.keys(newStructure);
  if (timeKeys.length === 0 || !timeKeys[currentTimeIndex]) return null;
  const currentTimeReadings = newStructure[timeKeys[currentTimeIndex]];
  const bpReadings = currentTimeReadings.filter((reading) => reading.sensorType === "bp");
  const otherReadings = currentTimeReadings.filter((reading) => reading.sensorType !== "bp");


    return (
      <div>
        {timeKeys.length > 1 && (
        <div className="flex justify-end items-center gap-2 h-12">
          <span className="text-sm font-semibold  bg-blue-100 px-2 text-blue-700 rounded-[5px]">{timeKeys[currentTimeIndex]}</span>
          {currentTimeIndex > 0 && (
            <button
              onClick={() => setCurrentTimeIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
              className="text-2xl text-blue-700 font-bold"
            >
              {"<"}
            </button>
          )}
          <p className="font-semibold text-sm bg-gray-200 px-2 rounded-[5px]">
            {`${currentTimeIndex + 1} of ${timeKeys.length} `}
          </p>
          {currentTimeIndex < timeKeys.length - 1 && (
            <button
              onClick={() => setCurrentTimeIndex((prevIndex) => Math.min(prevIndex + 1, timeKeys.length - 1))}
              className="text-2xl text-blue-700 font-bold"
            >
              {">"}
            </button>
          )}
        </div>
      )}
        {bpReadings.map((reading, index) => (
          <div
            key={index}
            className="mb-4 bg-white shadow-lg shadow-gray-100 rounded-xl p-4"
          >
            <h4 className="text-sm text-gray-400 mb-2">
              {sensorHeadings[reading.sensorType]}
            </h4>
            <div className="flex gap-8">
              <div className="flex-none">
                <p className="text-3xl text-bluetext font-bold">
                  {reading.readings}
                  <span className="text-sm">
                    {sensorunit[reading.sensorType]}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
        {otherReadings.length > 0 && (
          <div className="mb-4 bg-white shadow-lg shadow-gray-100 rounded-xl p-4 flex gap-8">
            {otherReadings.map((reading, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center"
              >
                <h4 className="text-sm text-gray-400 mb-2">
                  {sensorHeadings[reading.sensorType]}
                </h4>
                <div className="flex-none">
                  <p className="text-3xl text-bluetext font-bold">
                    {reading.readings}
                    <span className="text-sm">
                      {sensorunit[reading.sensorType]}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  //

  //
  function renderReadings(sensorKey) {
    if (!selectedDate || !filteredReadings || !filteredReadings[sensorKey]) {
      return <div>Oops! No data recorded yet</div>;
    }
  
    const timeKeys = Object.keys(filteredReadings[sensorKey][selectedDate] || {});
    if (timeKeys.length === 0 || !timeKeys[currentTimeIndex]) return null;
  
    const uniqueTimestamps = new Set();
    const currentTimeReadings = filteredReadings[sensorKey][selectedDate][timeKeys[currentTimeIndex]]
      .filter(reading => {
        if (uniqueTimestamps.has(reading.timestamp)) {
          return false;
        } else {
          uniqueTimestamps.add(reading.timestamp);
          return true;
        }
      });
  
    const currentTime = timeKeys[currentTimeIndex];
  
    return (
      <div>
        <div className="flex justify-end items-center gap-2 h-12">
          <span className="text-sm font-semibold  bg-blue-100 px-2 text-blue-700 rounded-[5px]">{currentTime}</span>
          {currentTimeIndex > 0 && (
            <button
              onClick={() => setCurrentTimeIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
              className="text-2xl text-blue-700 font-bold"
            >
              {"<"}
            </button>
          )}
          <p className="font-semibold text-sm bg-gray-200 px-2 rounded-[5px]">
            {`${currentTimeIndex + 1} of ${timeKeys.length}`}
          </p>
          {currentTimeIndex < timeKeys.length - 1 && (
            <button
              onClick={() => setCurrentTimeIndex((prevIndex) => Math.min(prevIndex + 1, timeKeys.length - 1))}
              className="text-2xl  text-blue-700 font-bold"
            >
              {">"}
            </button>
          )}
        </div>
        {currentTimeReadings.map((reading, index) => (
          <div key={index} className="mb-4 bg-white shadow-lg shadow-gray-100 rounded-xl p-4">
            <h4 className="text-sm text-gray-400 mb-2">
              {sensorHeadings[sensorKey]}
            </h4>
            <div className="flex gap-8">
              <div className="flex-none">
                <p className="text-3xl text-bluetext font-bold">
                  {reading.readings}
                  <span className="text-sm">{sensorunit[sensorKey]}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  

  //

  return (
    <main className="p-4 pt-8 bg-lightblue h-screen w-screen flex flex-col justify-around">
      <div className="flex justify-between">
        <Link href="/dashboard">
          <span className="flex justify-center items-center gap-2">
            <Image src={arrow_left} alt="left_arrow" className="h-4" />
            <h2 className="text-bluetext font-bold">Your Last Readings</h2>
          </span>
        </Link>
        <Button>Share</Button>
      </div>
      <div className="bg-white h-[80%] rounded-lg p-2 shadow-lg shadow-gray-100">
        <Tabs defaultValue="allreadings" className="w-full flex gap-4 h-full">
          <TabsList className="flex flex-col w-max gap-2 h-full items-start justify-start bg-lightblue text-bluetext">
            <TabsTrigger
              value="allreadings"
              onClick={() => updateSelectedSensor("allreadings")}
            >
              All Readings
            </TabsTrigger>
            {renderTabsTriggers()}
          </TabsList>
          <div className="flex flex-col w-full h-full">
            <div className="flex overflow-x-auto h-[3rem] w-full justify-between items-center">
              <Button className="w-2">{`<`}</Button>
              <span className="flex gap-2 scale-90">
                {[...uniqueDates].map((date) => (
                  <Button
                    key={date}
                    className=" px-2  cursor-pointer"
                    variant = {`${selectedDate === date ? '' : 'secondary'}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </Button>
                ))}{" "}
              </span>
              <Button className="w-2">{`>`}</Button>
            </div>
            <TabsContent value="allreadings">
              <div className="flex justify-between flex-col bg-[#F9F9F9] rounded-xl p-2 pt-0  gap-4  h-[23rem]">
                {renderAllReadings()}
              </div>
            </TabsContent>

            {Object.keys(filteredReadings).map((sensorKey) => {
              return (
                <TabsContent key={sensorKey} value={sensorKey}>
                  <div className="flex justify-between flex-col bg-[#F9F9F9] rounded-xl p-2 pt-0 gap-4 overflow-y-auto h-[20rem]">
                    {renderReadings(sensorKey)}
                  </div>
                </TabsContent>
              );
            })}

            <TabsContent value="bt">Bt</TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
