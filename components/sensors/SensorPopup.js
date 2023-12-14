"use client";
//bpsensor
import bp1 from "@/public/assets/instructions/bp1.png";
import bp2 from "@/public/assets/instructions/bp2.png";
import bp3 from "@/public/assets/instructions/bp3.png";
import bp4 from "@/public/assets/instructions/bp4.png";
import bp5 from "@/public/assets/instructions/bp5.png";
import { useState, useEffect, useRef } from "react";
import InstructionMenu from "./InstructionMenu";
import CircularProgress from "./CircularProgress";
import { Button } from "../ui/button";
import Reading from "./Reading";
import { commands } from "../../Sensor Config/commands";
import {
  requestSerialPort,
  handleWriteToSerialPort,
  disconnectFromPort,
} from "../../Sensor Config/SerialFunctions";

const SensorPopup = ({ heading, instructions, sensortype, toast }) => {
  const sensor_images = {
    bp: [bp1, bp2, bp3, bp4, bp5],
  };

  const sensor_config = {
    bp: [
      { unit: "mmHg", name: "BP - Systolic" },
      { unit: "mmHg", name: "BP - Diastolic" },
    ],
    spo2: [{ unit: "%", name: "SpO2" }],
  };

  const [ino, setino] = useState(0);
  const [state, setstate] = useState("instructions");
  const [sensorData, setSensorData] = useState("");
  const isConnected = useRef(false);
  const portRef = useRef(null);
  const readerRef = useRef(null);
  const commandWritten = useRef(false);
  let results = [];
  
const readData = async () => { 
  console.log(readerRef.current)
  try {
    while (readerRef.current) {
      const { value, done } = await readerRef.current.read();
      if (done) {
        return;
      }
      setSensorData(value);
    }
  } catch (error) {
    console.error("Error reading data:", error);
  } finally {
    readerRef.current.releaseLock();
  }
};

const handleSkip = async () => {
  setino(instructions.length-1)
  if (!isConnected.current)
  requestSerialPort(isConnected, portRef, readerRef);
}


  const handleNext = async () => {
    if (ino + 1 < instructions.length) {
      setino((prevState) => prevState + 1);
      if (!isConnected.current)
        requestSerialPort(isConnected, portRef, readerRef);
    } else {
      if (!isConnected.current) {
        console.error("Failed to connect to serial port.");
        return;
      }
      setstate("reading");
      await handleWriteToSerialPort(
        commands[sensortype],
        portRef,
        isConnected,
        commandWritten,
        setSensorData,
        readerRef,
      );
      readData();
    }
  };

  

  const handleBack = () => {
    if (ino - 1 >= 0) setino((prevState) => prevState - 1);
  };

  return (
    <>
      {state === "instructions" && (
        <div className=" w-[70%]">
          <InstructionMenu
            ino={ino}
            heading={heading}
            instructions={instructions}
            sensor_images={sensor_images}
            sensortype={sensortype}
            handleBack={handleBack}
            handleNext={handleNext}
            handleSkip={handleSkip}
          />
        </div>
      )}

      {state === "reading" && (
        <div className="w-full h-full flex flex-col justify-center items-center gap-16">
          <CircularProgress
            text={50}
            value={sensorData[5]? sensorData[5] * 2 : 0}
            unit={sensor_config[sensortype][0].unit}
            max={200}
          />
          <Button className="w-32" variant={"destructive"} onClick={() => {disconnectFromPort(readerRef,portRef,isConnected)}} >
            Stop
          </Button>
        </div>
      )}

      {state === "results" && (
        <div className="flex flex-col gap-8 w-[85%] h-full">
          <h1 className="text-3xl font-semibold text-slate-600 text-center m">
            Test Successfully Taken
          </h1>
          <Reading
            results={[
              { name: "BP-Systolic", value: "120", unit: "mmHg" },
              { name: "BP-Diastolic", value: "80", unit: "mmHg" },
            ]}
          />
          <div className="buttons flex justify-center gap-4 w-full mt-4">
            <Button
              className="w-56 h-14 shadow-xl shadow-gray-200 "
              variant="outline"
            >
              Check Again
            </Button>
            <Button className="w-56 h-14 shadow-lg shadow-blue-200 ">
              Done
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SensorPopup;
