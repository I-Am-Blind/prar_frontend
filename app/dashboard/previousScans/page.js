"use client";

import { GetReadings } from "@/Database/Sensors";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import moment from "moment";

import right_arrow_white_svg from "@/public/assets/right_arrow_white.svg";
import Image from "next/image";

export default function Page() {
  const [readings, setreadings] = useState([]);
  const [uniqueDates, setUniqueDates] = useState(new Set());
  const [filteredReadings, setFilteredReadings] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
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

  useEffect(() => {
    console.log(readings, uniqueDates);
  }, [readings, uniqueDates]);

  function extractUniqueDates(readings) {
    let dates = new Set();
    Object.keys(readings).forEach((sensor) => {
      readings[sensor].forEach((reading) => {
        const formattedDate = moment(
          reading.timestamp,
          "MMM DD, YYYY at hh:mm:ss A Z"
        ).format("DD/MM/YY");
        dates.add(formattedDate);
      });
    });
    setUniqueDates(dates);
  }

  useEffect(() => {
    filterReadingsByDate(selectedDate);
    console.log(selectedDate);
  }, [selectedDate, readings]);

  function filterReadingsByDate(date) {
    let newFilteredReadings = {};
    Object.keys(readings).forEach((sensor) => {
      newFilteredReadings[sensor] = readings[sensor].filter(
        (reading) =>
          new Date(reading.timestamp).toLocaleDateString("en-GB") === date
      );
    });
    setFilteredReadings(newFilteredReadings);
  }

  return (
    <main className="p-4 pt-8 bg-[#f3f9ff] h-screen w-screen flex flex-col justify-around">
      <div className="flex justify-between">
        <h2>Your Last Readings</h2>
        <Button>Share</Button>
      </div>
      <div className="bg-white h-[80%] rounded-lg p-2 ">
        <Tabs defaultValue="allreadings" className="w-full flex gap-4 h-full">
          <TabsList className="flex flex-col w-max gap-2 h-full items-start justify-start bg-[#f3f9ff]">
            <TabsTrigger value="allreadings">All Readings</TabsTrigger>
            <TabsTrigger value="bt">Body Temperature</TabsTrigger>
            <TabsTrigger value="sp02">Sp02</TabsTrigger>
          </TabsList>
          <div className="flex flex-col w-full">
            <div className="flex overflow-x-auto h-max w-full justify-between items-center gap-4">
              <Button>{`<`}</Button>
              <>
                {[...uniqueDates].map((date) => (
                  <Button
                    key={date}
                    className=" px-2  cursor-pointer"
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </Button>
                ))}{" "}
              </>
              <Button>{`>`}</Button>
            </div>
            <TabsContent value="allreadings">
              <div className="flex justify-between flex-col bg-[#F9F9F9] rounded-xl p-4 gap-4 overflow-y-auto">
                {Object.keys(readings)
                  .filter((sensorKey) => {
                    // Check if there are valid readings for this sensor
                    return readings[sensorKey].some(
                      (reading) => reading.readings !== "undefined/undefined"
                    );
                  })
                  .map((sensorKey) => {
                    let sum = 0;
                    let count = 0;
                    let sumSystolic = 0;
                    let sumDiastolic = 0;

                    readings[sensorKey].forEach((reading) => {
                      if (reading.readings !== "undefined/undefined") {
                        if (sensorKey === "bp") {
                          const [systolic, diastolic] = reading.readings
                            .split("/")
                            .map(Number);
                          sumSystolic += systolic;
                          sumDiastolic += diastolic;
                          count++;
                        } else {
                          sum += parseFloat(reading.readings);
                          count++;
                        }
                      }
                    });

                    const average = count > 0 ? (sum / count).toFixed(2) : null;
                    const averageSystolic =
                      count > 0 ? (sumSystolic / count).toFixed(2) : null;
                    const averageDiastolic =
                      count > 0 ? (sumDiastolic / count).toFixed(2) : null;

                    return (
                      <div key={sensorKey} className="text-sm">
                        <h3 className="font-semibold text-gray-400 text-xs">
                          {sensorHeadings[sensorKey]}
                        </h3>
                        <div>
                          {sensorKey === "bp" ? (
                            <span className="flex gap-8 ">
                              <span className="flex flex-col">
                                <span>Bp Systolic</span>
                                <span className="font-bold text-xl text-[#1C274C]">
                                  {averageSystolic} {sensorunit[sensorKey]}
                                </span>
                              </span>
                              <span className="flex flex-col">
                                <span>Bp Diastolic</span>
                                <span className="font-bold text-xl text-[#1C274C]">
                                  {averageDiastolic} {sensorunit[sensorKey]}
                                </span>
                              </span>
                            </span>
                          ) : (
                            <span className="font-bold text-xl text-[#1C274C]">
                              {average} {sensorunit[sensorKey]}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>

            <TabsContent value="bt">Bt</TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
