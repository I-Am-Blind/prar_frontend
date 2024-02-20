"use client";
//bpsensor
import { useState, useEffect, useRef } from "react";
import InstructionMenu from "./InstructionMenu";
import CircularProgress from "./CircularProgress";
import { Button } from "../ui/button";
import Reading from "./Reading";
import { commands } from "../../Sensor Config/commands";
import { disconnectFromPort } from "../../Sensor Config/SerialFunctions";
import { UserDataManager } from "@/Config/userManager";
import { useRouter } from "next/navigation";

const BpSensorPopup = ({ heading, instructions, sensor_images, toast }) => {

  const [ino, setino] = useState(0);
  const [state, setstate] = useState("instructions");
  const [sensorData, setSensorData] = useState(0);
  const [progressvalue, setprogressvalue] = useState(0);
  const isConnected = useRef(false);
  const portRef = useRef(null);
  const readerRef = useRef(null);
  const sensorstarted = useRef(false);
  const sensorscompleted= useRef(false);
  const [sensorresults, setsensorresults] = useState([]);
  const userDataManager = new UserDataManager();
  const router = useRouter();

  const readData = async () => {
    try {
      const { value, done } = await readerRef.current.read();
      if (value[4] !== 0) sensorstarted.current = true;
      if ((done || value[4] == 0) && sensorstarted.current) {
        setsensorresults([
          { unit: "mmHg", name: "Systolic", value: value[6] },
          { unit: "mmHg", name: "Diastolic", value: value[8] },
        ]);
        sensorscompleted.current = true;
        setstate("results");
      }

      setSensorData(value);
      setprogressvalue(value[5] * 2);
      readData();
    } catch (error) {
      console.error("Error reading data:", error);
    }
  };

  const requestSerialPort = async () => {
    if (!("serial" in navigator)) {
      console.error("WebSerial API not supported in this browser.");
      return;
    }
    if (isConnected.current) {
      console.log("Already connected to a serial port");
      return;
    }

    try {
      const ports = await navigator.serial.getPorts();
      let port = ports.find(
        (port) =>
          port.getInfo().usbVendorId === 0x1a86 &&
          port.getInfo().usbProductId === 0x7523
      );
      if (!port) {
        port = await navigator.serial.requestPort();
      }

      await port.open({ baudRate: 115200 });
      isConnected.current = true;
      portRef.current = port;
      readerRef.current = port.readable.getReader();
      console.log("conected to serial port");
    } catch (error) {
      console.error("Error accessing serial port:", error);
    }
  };

  const writeToSerialPort = async (data) => {
    if (!portRef.current || !isConnected.current) {
      console.log("Serial port is not connected.");
      return;
    }

    try {
      const writer = portRef.current.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
      console.log("Data written to serial port:", data);
    } catch (error) {
      console.error("Error writing to serial port:", error);
    }
  };

  const handleWriteToSerialPort = async () => {
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const delayTime = 10;
    for (const command of commands['bp']) {
      const bytes = command.map((hexString) => parseInt(hexString, 16));
      const buffer = new Uint8Array(bytes);
      writeToSerialPort(buffer);
      await delay(delayTime);
    }
    readData();
  };

  const handleBack = () => {
    if (ino - 1 >= 0) setino((prevState) => prevState - 1);
  };

  const handleSkip = async () => {
    setino(instructions.length - 1);
    if (!isConnected.current)
      requestSerialPort(isConnected, portRef, readerRef);
  };

  const handleNext = async () => {
    if (ino + 1 < instructions.length) {
      setino((prevState) => prevState + 1);
      if (!isConnected.current)
        requestSerialPort(isConnected, portRef, readerRef);
    } else {
      setstate("reading");
      handleWriteToSerialPort();
    }
  };

  return (
    <div className="overlay h-screen w-screen absolute flex justify-center items-center ">
      <div className="h-[26rem] w-[58rem]  rounded-2xl shadow-2xl shadow-gray-300 p-8 bg-background">
      {state === "instructions" && (
          <InstructionMenu
            ino={ino}
            heading={heading}
            instructions={instructions}
            sensor_images={sensor_images}
            handleBack={handleBack}
            handleNext={handleNext}
            handleSkip={handleSkip}
          />
      )}

      {state === "reading" && (
        <div className="flex flex-col justify-center items-center gap-8">
          <CircularProgress
            value={progressvalue}
            unit={'mmHg'}
            max={200}
          />
          <Button
            className="w-32"
            variant={"destructive"}
            onClick={() => {
              disconnectFromPort(readerRef, portRef, isConnected);
              setstate('results')
            }}
          >
            Stop
          </Button>
        </div>
      )}

      {state === "results" && (
        <div className="flex flex-col gap-4 items-center h-full">
          <h1 className="text-2xl font-semibold text-slate-600 text-center ">
           Test Successfully Taken
          </h1>
          <Reading results={sensorresults} userId={userDataManager.getAll().user?.id}  />
          <div className="buttons flex justify-center gap-4 w-full mt-4">
            <Button
              className="w-44 h-12 shadow-xl shadow-gray-200 "
              variant="outline"
              onClick={() => router.push('/dashboard/alltests/bloodpressure')}
            >
              Check Again
            </Button>
            <Button className="w-44 h-12 shadow-lg shadow-blue-200 "
           onClick={() => router.push('/dashboard/alltests')}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default BpSensorPopup;
