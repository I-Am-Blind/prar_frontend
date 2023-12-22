"use client";
//bpsensor
import { useState, useEffect, useRef } from "react";
import InstructionMenu from "./InstructionMenu";
import CircularProgress2 from "./CircularProgress2";
import { Button } from "../ui/button";
import Reading from "./Reading";
import { commands } from "../../Sensor Config/commands";
import { disconnectFromPort } from "../../Sensor Config/SerialFunctions";
import { useRouter } from "next/navigation";
import { UserDataManager } from "@/Config/userManager";

const BpSensorPopup = ({ heading, instructions, sensor_images, toast }) => {
  const [ino, setino] = useState(0);
  const [state, setstate] = useState("instructions");
  const [sensorData, setSensorData] = useState(0);
  const [progressvalue, setprogressvalue] = useState(0);
  const isConnected = useRef(false);
  const portRef = useRef(null);
  const readerRef = useRef(null);
  const [sensorresults, setsensorresults] = useState([]);
  const counter = useRef(0);
  const  router  = useRouter()
  const userDataManager = new UserDataManager();

  const readData = async () => {
    try {
      const { value, done } = await readerRef.current.read();
      console.log(value)
    let lastnormalvalue = `${value[6]}/${value[5]}`
      if ( value[4] === 0 && value[6]<= 200 && value[5] <= 100) {
        if (counter.current <= 10) counter.current++;
        console.log(counter.current)
        
      }
      
      if (counter.current >= 10) {
        setstate('results')
        setSensorData(lastnormalvalue);
        setsensorresults([
            { unit: "Bpm", name: "Heart Rate", value: value[6] },
            { unit: "%", name: "Spo2", value: value[5] },
          ]);  
          await handleWriteToSerialPort(true)
          disconnectFromPort(readerRef, portRef, isConnected)
          return
      }
     
      readData();
      setprogressvalue(value[6]);
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

  const handleWriteToSerialPort = async (off = false) => {
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const delayTime = 100;
    if ( off ) {
      for (const command of commands["hroff"]) {
        const bytes = command.map((hexString) => parseInt(hexString, 16));
        const buffer = new Uint8Array(bytes);
        writeToSerialPort(buffer);
        await delay(delayTime);
      }
    }
    for (const command of commands["hr"]) {
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
            <CircularProgress2 value={progressvalue} unit={"Bpm"} max={200} />
            <Button
              className="w-32"
              variant={"destructive"}
              onClick={() => {
                disconnectFromPort(readerRef, portRef, isConnected);
                setstate("results");
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
                onClick = { () => { setstate('instructions') ; setino(0) } }
              >
                Check Again
              </Button>
              <Button className="w-44 h-12 shadow-lg shadow-blue-200 "
              onClick = {()=>{router.push('/dashboard')}}
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
