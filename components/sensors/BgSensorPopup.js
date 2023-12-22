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


const BgSensorPopup = ({ heading, instructions, sensor_images, toast }) => {

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
     return
    try {
      while (true ) {
        const { value, done } = await readerRef.current.read();
        if ( value[0] == 160 && value[1] == 1 && value[2] == 181 && value[3] == 75 )
          handleNext()


         if (state === 'instructions'&& value[0] == 245 && value[1] == 160 && value[2] == 2 && value[3] == 180 )
         {
          setstate('reading')
          setprogressvalue(value[4])

         }    

         if (state === 'reading'&& value[0] == 245 && value[1] == 160 && value[2] == 2 && value[3] == 180 )
          setprogressvalue(value[4])
         
         if (state === 'reading'&& value[0] == 160 && value[1] == 2 && value[2] == 180 )
          setprogressvalue(value[3])

          resultbuffer.current.push(...value)
          while (resultbuffer.current.length > 12) {
            resultbuffer.current.shift();
        }

        
         if (  resultbuffer.current[0] === 245 && resultbuffer.current[1] === 160 && resultbuffer.current[2] === 8 && resultbuffer.current[3] === 178 && resultbuffer.current[4] === 1 )
         {
          setstate('results')       
          const result = resultbuffer.current[5] *256 + resultbuffer.current[6]
          setsensorresults([{ unit: "%ppm", name: "Blood Glucose", value: result }])
          return;
         }        

           console.log(value)
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

  useEffect( () => {
    if (!isConnected.current)
            requestSerialPort(isConnected, portRef, readerRef);
    return () => {
      if (isConnected.current)
       disconnectFromPort(readerRef,portRef,isConnected)
    }
  }, [])
  

  return (
    <div className="overlay h-screen w-screen absolute flex justify-center items-center ">
      <div className="h-[26rem] w-[58rem]  rounded-2xl shadow-2xl shadow-gray-300 p-8 bg-background">
        {state === "instructions" && (
          <>
            <div className="header flex  items-center">
              <h2 className="font-semibold text-xl">{heading}</h2>
              <Image alt='speak' src={speak} className="w-14"/>
            </div>
            <div className="instruction flex justify-between w-full  items-center h-4/6">
              <p className="w-[50%]  text-lg">{instructions[ino]}</p>
              <Image
                src={sensor_images[ino]}
                alt="image"
                className={`w-64 object-contain ${sensor_images[ino] === "bg2" && 'w-[26rem] -mr-8' }`}
              />
            </div>         
            <span className="flex w-full justify-end mt-4">
            <Button className="w-24 " onClick={router.back} >Exit</Button>
            </span>
          </>
        )}

        {state === "reading" && (
          <div className="flex flex-col justify-center items-center gap-8">
            <h2 className="font-semibold text-xl">Please wait while the sample is analyzed</h2>
            <CircularProgress value={progressvalue} unit={'seconds'} max={7} />
          </div>
        )}

        {state === "results" && (
          <div className="flex flex-col gap-4 items-center h-full">
            <h1 className="text-2xl font-semibold text-slate-600 text-center ">
              Test Successfully Taken
            </h1>
            <Reading results={sensorresults} userId={userDataManager.getAll().user?.id} />
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

export default BgSensorPopup;
