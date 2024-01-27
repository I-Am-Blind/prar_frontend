"use client";

import { GetReadings } from "@/Database/Sensors";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import moment from "moment";

import arrow_left from "@/public/assets/left_small_arrow_blue.svg";
import Image from "next/image";

export default function Page() {
  const [readings, setreadings] = useState([]);
  const [uniqueDates, setUniqueDates] = useState(new Set());
  const [filteredReadings, setFilteredReadings] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
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
    t: "F",
    hr: "BPM",
    sp: "%",
  };

  useEffect(() => {
    async function getlastreadings() {
      const readings = await GetReadings();
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
        if (reading.readings === undefined || reading.readings === 'undefined' || reading.readings === 'undefined/undefined') 
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
  }

  //
  const updateSelectedSensor = (sensorKey) => {
    setSelectedSensor(sensorKey);

    if ( filteredReadings[sensorKey]) {
      const dates = Object.keys(filteredReadings[sensorKey]).sort();
      if (dates.length > 0) {
        const firstDate = dates[0];
        setSelectedDate(firstDate);

        const times = Object.keys(filteredReadings[sensorKey][firstDate]).sort();
        if (times.length > 0) {
          setSelectedTime(times[0]);
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

  //
  function renderTimeButtons() {
    if (!selectedDate || !filteredReadings) return null;

    let times = new Set();
    if (selectedSensor === "allreadings") {
      Object.keys(filteredReadings).forEach((sensorKey) => {
        const dateReadings = filteredReadings[sensorKey][selectedDate];
        if (dateReadings) {
          Object.keys(dateReadings).forEach((time) => {
            times.add(time);
          });
        }
      });
    } else {
      const dateReadings = filteredReadings[selectedSensor][selectedDate];
      if (dateReadings) {
        Object.keys(dateReadings).forEach((time) => {
          times.add(time);
        });
      }
    }

    return Array.from(times).map((time) => (
      <Button
        key={time}
        className=" text-xs px-2 cursor-pointer h-6 rounded-lg"
        onClick={() => setSelectedTime(time)}
        variant = { time === selectedTime ? 'default' : 'secondary'}
      >
        {time}
      </Button>
    ));
  }

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
    if (!selectedDate || !selectedTime || !filteredReadings) return null;

    const sensorMap = {};

    Object.keys(filteredReadings).forEach((sensorKey) => {
      const dateReadings = filteredReadings[sensorKey][selectedDate];
      if (
        dateReadings &&
        dateReadings[selectedTime] &&
        dateReadings[selectedTime].length > 0
      ) {
        const sensorReadings = dateReadings[selectedTime];

        sensorMap[sensorKey] = sensorReadings.reduce((acc, reading) => {
          let isInvalidReading =
            reading.readings === undefined ||
            (typeof reading.readings === "string" &&
              reading.readings.includes("undefined"));

          if (isInvalidReading) return acc;

          const formattedTimestamp = moment(
            reading.timestamp,
            "MMM DD, YYYY at hh:mm:ss A Z"
          ).format("h:mm A");

          acc[formattedTimestamp] = { ...reading, formattedTimestamp };
          return acc;
        }, {});
      }
    });

    return Object.keys(sensorMap).map((sensorKey) => (
      <div
        key={sensorKey}
        className="mb-4 bg-white shadow-lg shadow-gray-100 rounded-xl p-4"
      >
        <h4 className="text-sm text-gray-400 mb-2">
          {sensorHeadings[sensorKey]}
        </h4>
        <div className="flex  gap-8">
          {Object.values(sensorMap[sensorKey]).map((reading, index) => (
            <div key={index} className="flex-none">
              <p className="text-3xl text-bluetext font-bold">
                {parseFloat(reading.readings).toFixed(2)}{" "}
                <span className="text-sm">{sensorunit[sensorKey]}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    ));
  }

  //

  //
  function renderReadings(sensorKey) {

    if (!selectedDate || !selectedTime || !filteredReadings) {
      return (
        <div>
          Oops ! No data recorded yet
        </div>
      )
    }

    const sensorMap = {};

    const dateReadings = filteredReadings[sensorKey][selectedDate];
    if (
      dateReadings &&
      dateReadings[selectedTime] &&
      dateReadings[selectedTime].length > 0
    ) {
      const sensorReadings = dateReadings[selectedTime];

      sensorMap[sensorKey] = sensorReadings.reduce((acc, reading) => {
        let isInvalidReading =
          reading.readings === undefined ||
          (typeof reading.readings === "string" &&
            reading.readings.includes("undefined"));

        if (isInvalidReading) return acc;

        const formattedTimestamp = moment(
          reading.timestamp,
          "MMM DD, YYYY at hh:mm:ss A Z"
        ).format("h:mm A");

        acc[formattedTimestamp] = reading;
        return acc;
      }, {});
    }

    return Object.keys(sensorMap).map((sensorKey) => (
      <div
        key={sensorKey}
        className="mb-4 bg-white shadow-lg shadow-gray-100 rounded-xl p-4"
      >
        <h4 className="text-sm text-gray-400 mb-2">
          {sensorHeadings[sensorKey]}
        </h4>
        <div className="flex  gap-8">
          {Object.values(sensorMap[sensorKey]).map((reading, index) => (
            <div key={index} className="flex-none">
              <p className="text-3xl text-bluetext font-bold">
                {parseFloat(reading.readings).toFixed(2)}{" "}
                <span className="text-sm">{sensorunit[sensorKey]}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    ));
  }
  //

  return (
    <main className="p-4 pt-8 bg-lightblue h-screen w-screen flex flex-col justify-around">
      <div className="flex justify-between">
        <span className="flex justify-center items-center gap-2">
          <Image src={arrow_left} alt="left_arrow" className="h-4" />
          <h2 className="text-bluetext font-bold">Your Last Readings</h2>
        </span>
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
            <div className="flex overflow-x-auto h-[3rem] w-full justify-between items-center gap-4">
              <Button className="w-2">{`<`}</Button>
              <span>
                {[...uniqueDates].map((date) => (
                  <Button
                    key={date}
                    className=" px-2  cursor-pointer"
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </Button>
                ))}{" "}
              </span>
              <Button className="w-2">{`>`}</Button>
            </div>
            <div className="flex overflow-x-auto h-[3rem] w-max justify-between items-center gap-2">
              {renderTimeButtons()}
            </div>
            <TabsContent value="allreadings">
              <div className="flex justify-between flex-col bg-[#F9F9F9] rounded-xl p-2 gap-4 overflow-y-auto h-[20rem]">
                {renderAllReadings()}
              </div>
            </TabsContent>

            {Object.keys(filteredReadings).map((sensorKey) => {
              return (
                <TabsContent key={sensorKey} value={sensorKey}>
                  <div className="flex justify-between flex-col bg-[#F9F9F9] rounded-xl p-2 gap-4 overflow-y-auto h-[20rem]">
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
