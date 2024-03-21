"use client";
import { useState, useEffect, useRef} from "react";
import CircularProgress from "./CircularProgress";
import { Button } from "../ui/button";
import Reading from "./Reading";
import { disconnectFromPort } from "../../Sensor Config/SerialFunctions";
import Image from "next/image";
import speak from '@/public/assets/icons/speak.svg'
import  { useRouter } from "next/navigation";
import { UserDataManager } from "@/Config/userManager";
import InstructionMenu from "./InstructionMenu";
import Link from "next/link";


const TempSensorPopup = ({ heading, instructions, sensor_images, toast }) => {

  const [ino, setino] = useState(0);
  const [state, setstate] = useState("instructions");
  const [progressvalue, setprogressvalue] = useState(0);
  const isConnected = useRef(false);
  const portRef = useRef(null);
  const readerRef = useRef(null);
  const [sensorresults, setsensorresults] = useState([]);
  const  router  = useRouter()
  const resultbuffer = useRef([])
  const userDataManager = new UserDataManager();


  const readData = async () => {
    if (!isConnected.current)
        return;
    try {
        let dataBuffer = "";
        while (true) {
            const { value, done } = await readerRef.current.read();
            dataBuffer += String.fromCharCode.apply(null, value);
            const newlineIndex = dataBuffer.indexOf("\n");
            if (newlineIndex !== -1) {
                const temperatureStr = dataBuffer.substring(0, newlineIndex);
                const temperatureValue = parseFloat(temperatureStr);
                setprogressvalue(temperatureValue)
                dataBuffer = dataBuffer.substring(newlineIndex + 1);
            }
        }
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

      await port.open({ baudRate: 9600 });
      isConnected.current = true;
      portRef.current = port;
      readerRef.current = port.readable.getReader();
      console.log("conected to serial port");
      await readData();
    } catch (error) {
      console.error("Error accessing serial port:", error);
    }
  };



  const handleNext = async () => {
    if (ino + 1 < instructions.length) {
      setino((prevState) => prevState + 1);
    } else {
      setstate("reading");   
    }
  };

  const handleBack = () => {
    if (ino - 1 >= 0) setino((prevState) => prevState - 1);
  };

  const handleSkip = async () => {
    setino(instructions.length - 1);
    if (!isConnected.current)
      requestSerialPort(isConnected, portRef, readerRef);
  };


  useEffect( () => {
    if (!isConnected.current)
            requestSerialPort(isConnected, portRef, readerRef);
    return () => {
      if (isConnected.current)
       disconnectFromPort(readerRef,portRef,isConnected)
    }
  }, [])
  

  const handleDoneClick = () => {
    router.push('/dashboard');
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
            <CircularProgress value={progressvalue} unit={'°C'} max={100} />
            <Button
                className="w-44 h-12 shadow-xl shadow-gray-200 "
                onClick = { () => { setstate('results');setsensorresults([
                    { unit: "°C", name: "Body Temperature", value: progressvalue },
                  ]);} }
              >
                Record
              </Button>
          </div>
        )}

        {state === "results" && (
          <div className="flex flex-col gap-4 items-center h-full">
            <h1 className="text-2xl font-semibold text-slate-600 text-center ">
              Test Successfully Taken
            </h1>
            <Reading results={sensorresults} userId={userDataManager.getAll().user?.id} />
            <div className="buttons flex justify-center gap-4 w-full mt-4">
            <Link href='/dashboard/alltests/temperature'>
            <Button
              className="w-44 h-12 shadow-xl shadow-gray-200 "
              variant="outline"
            >
              Check Again
            </Button></Link>
              <Link href="/dashboard/alltests">
                <Button className="w-44 h-12 shadow-lg shadow-blue-200 ">
                  Done
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempSensorPopup;
