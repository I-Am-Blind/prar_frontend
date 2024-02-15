"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

// import CanvasAnimationPage from './ecg'; // Replace with your actual component path
const CanvasAnimationPage = dynamic(
  () => import("./ecg"), // replace './YourComponent' with the path to your component
  { ssr: false }
);



const EcgPopupFrame = (props) => {
  const router = useRouter();

  const [showTestPage, setShowTestPage] = useState(false);
  const [mainPage, setMainPage] = useState(null);
  const [sequenceNumber, setSequenceNumber] = useState(1);
  const [maxNumber, setMaxNumer] = useState({});
  const [dynamicProps, setDynamicProps] = useState({});
  const [optionSelected, setOptionSelected] = useState(null);
  const socketRef = useRef(null); // Using ref to persist socket instance
  const [mode,setMode]= useState({});
  const [ecgValue, setEcgValue] = useState(null); // Initial state



const [v1, setV1] = useState([]);
const [v2, setV2] = useState([]);
const [v3, setV3] = useState([]);
const [v4, setV4] = useState([]);
const [v5, setV5] = useState([]);
const [v6, setV6] = useState([]);
const [vii, setVii] = useState([]);
const [vi, setVi] = useState([]); // Note: React state hooks should follow the camelCase naming convention


  const SOCKET_URL = 'http://localhost:5005';


  useEffect(() => {
    if (mainPage === 1 && showTestPage) {
        setMode(1); 
        setVii(currentVii => [...currentVii, ecgValue]);
        console.log(vii); // Log here after the state update
    }
    // ... rest of the useEffect logic
  }, [mainPage, showTestPage,ecgValue]);

  useEffect(() => {
    if (mainPage === 2 && showTestPage) {
        setMode(2); // Assuming setMode is a state setter function
        if (showTestPage) { // Check showTestPage once instead of in every condition
          switch(sequenceNumber) {
            case 1:
              setV1(currentV1 => [...currentV1, ecgValue]);
              console.log("v1:"+ v1)
              break;
            case 2:
              setV2(currentV2 => [...currentV2, ecgValue]);
              console.log("v2:"+ v2)
              break;
            case 3:
              setV3(currentV3 => [...currentV3, ecgValue]);
              console.log("v3:"+ v3)
              break;
            case 4:
              setV4(currentV4 => [...currentV4, ecgValue]);
              console.log("v4:"+ v4)
              break;
            case 5:
              setV5(currentV5 => [...currentV5, ecgValue]);
              console.log("v5:"+ v5)
              break;
            case 6:
              setV6(currentV6 => [...currentV6, ecgValue]);
              console.log("v6:"+ v6)
              break;
            case 7:
              setVii(currentVii => [...currentVii, ecgValue]);
              console.log("II:"+ vii)
              break;
            default:
              // Handle any other case or do nothing
          }
        }
    }
  }, [mainPage, showTestPage, sequenceNumber, ecgValue]); // Include relevant dependencies


  useEffect(() => {
    if (mainPage === 3 && showTestPage) {
        setMode(3); // Assuming setMode is a state setter function
        if (showTestPage) { // Check showTestPage once instead of in every condition
          switch(sequenceNumber) {
            case 1:
              setV1(currentV1 => [...currentV1, ecgValue]);
              console.log("v1:"+ v1)
              break;
            case 2:
              setV2(currentV2 => [...currentV2, ecgValue]);
              console.log("v2:"+ v2)
              break;
            case 3:
              setV3(currentV3 => [...currentV3, ecgValue]);
              console.log("v3:"+ v3)
              break;
            case 4:
              setV4(currentV4 => [...currentV4, ecgValue]);
              console.log("v4:"+ v4)
              break;
            case 5:
              setV5(currentV5 => [...currentV5, ecgValue]);
              console.log("v5:"+ v5)
              break;
            case 6:
              setV6(currentV6 => [...currentV6, ecgValue]);
              console.log("v6:"+ v6)
              break;
            case 7:
              setVii(currentVii => [...currentVii, ecgValue]);
              console.log("II:"+ vii)
              break;
            case 8:
              setVi(currentVi => [...currentVi, ecgValue]);
              console.log("I:"+ vi)
              break;
            default:
              // Handle any other case or do nothing
          }
        }
    }
  }, [mainPage, showTestPage, sequenceNumber, ecgValue]); // Include relevant dependencies
  

 


  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io.connect(SOCKET_URL);

    const handleEcgData = (receivedData) => {
        const value = receivedData.data;
        // console.log(value);
        setEcgValue(value); // Update state with the new value

        
        // ecgTimeSeries.append(new Date().getTime(), value);
    };


    socketRef.current.on("ecg_data", handleEcgData);

    SensorRead();

    return () => {
        SensorStop();
        socketRef.current.off("ecg_data", handleEcgData);
        socketRef.current.disconnect();
    };
}, []);

const SensorStop = () => {
  socketRef.current.emit("send_message_ecg", { message: "Stop" });
};

const SensorRead = () => {
  socketRef.current.emit("send_message_ecg", { message: "Start" });
};


  useEffect(() => {
    // Update dynamic properties based on the sequence number
    setDynamicProps({
      [`c${sequenceNumber}`]: "bg-[#FBC60C]",
      img: `/vector-1886-${sequenceNumber}.svg`,
      onExitClick: () => {
        /* Define exit click handler here if needed */
      },
    });
  }, [sequenceNumber]);

  const handleStartTest = () => {
    setShowTestPage(true);
  
    // Delay the execution of the sequence number update
    setTimeout(() => {
      setSequenceNumber(prevSequenceNumber => {
        if (sequenceNumber < maxNumber) {
          return prevSequenceNumber + 1;
        } else {
          return prevSequenceNumber; // Keep the sequence number unchanged if it reaches maxNumber
        }
      });
    }, 10100); // Delay of 10000 milliseconds (10 seconds)
  };

  useEffect(() => {
    if (showTestPage) {
      const timer = setTimeout(() => {
        setShowTestPage(false);

        // Check if sequenceNumber equals maxNumber right after setting showTestPage to false
        if (sequenceNumber === maxNumber) {
          setMainPage(4);
        }
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [showTestPage, sequenceNumber, maxNumber]);

  const selectOption1 = (option) => {
    setMode(1);
    setSequenceNumber(7);
    setMaxNumer(7);
    setMainPage(1); // This will hide the selection page and show the ECG test page
  };

  const selectOption2 = (option) => {
    setSequenceNumber(1);
    setMaxNumer(7);
    setMainPage(2); // This will hide the selection page and show the ECG test page
  };

  const selectOption3 = (option) => {
    setSequenceNumber(1);
    setMaxNumer(8);
    setMainPage(3); // This will hide the selection page and show the ECG test page
  };

  return (
    <>
            <div className="relative justify-center flex items-center w-full h-full  text-left text-xs text-black font-manrope ">
          <div className="absolute top-[2rem] left-[0px] bg-[#FAFAFA] w-[100%] h-[75px]" />
          <button
            className=" absolute cursor-pointer [border:none] p-0 bg-[transparent] z-50 top-[56px] left-[17px] w-[81px] h-[27px]"
            onClick={() => router.back()}
          >
            <div className="absolute top-[1px] left-[0px] w-6 h-6">
              <div className="absolute top-[0px] left-[0px] w-3 h-3" />
              <div className="absolute top-[2.5px] left-[5.9px] w-[11.6px] h-[19px]">
                <Image
                  fill={true}
                  className="absolute top-[2.5px] left-[5.9px] w-[11.6px] h-[19px]"
                  alt=""
                  src="/vector-1886.svg"
                />
              </div>
            </div>
            <div className="absolute top-[0px] left-[40px] text-xl font-semibold font-manrope text-darkslategray-300 text-left">
              ECG
            </div>
          </button>
      {!mainPage && (
        <>

          <b className="absolute top-[56px] left-center text-xl text-darkslategray-300">
            ECG Test
          </b>
          <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-row justify-center items-center space-x-20">
              <button
                onClick={selectOption1}
                className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold py-6 px-12 rounded-2xl"
              >
                2 Lead
              </button>
              <button
                onClick={selectOption2}
                className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold py-6 px-12  rounded-2xl"
              >
                7 Lead
              </button>
              <button
                onClick={selectOption3}
                className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold py-6 px-12 rounded-2xl"
              >
                12 Lead
              </button>
            </div>
        </div>
        </>
      )}
        

      {mainPage === 1 && (
        <>
    
            <b className="absolute top-[56px] left-center text-xl text-darkslategray-300">
              2 Lead ECG Test
            </b>
            <div className="absolute  top-0 left-0 right-0 bottom-0 mx-auto justify-center flex items-center w-[1024px] h-[600px]  text-left text-xs text-black font-manrope">
              <div className="absolute top-[122px] left-[40px] w-[944px] h-[49.3px] flex justify-around items-center">
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 7
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c7
                            ? dynamicProps.c7
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  II
                </div>
              </div>

              <button
                className="cursor-pointer [border:none] p-0 bg-[transparent] absolute top-[502px] left-[803px] w-[181px] h-[58px]"
                id="StartButton"
                onClick={handleStartTest}
              >
                <div className="absolute top-[0px] left-[0px] w-[181px] h-[58px]">
                  <div className="absolute top-[0px] left-[0px] rounded-lg bg-[#1AB58F] shadow-[0px_10px_20px_rgba(7,_46,_62,_0.16)] w-[181px] h-[58px]" />
                  <b className="absolute top-[15px] left-[32px] text-xl flex font-manrope text-white text-center items-center justify-center w-[118px] h-7">{`Start test  >`}</b>
                </div>
              </button>
              <div className="absolute top-[215px] left-[73px] w-[99px] h-9 font-inter">
                <div className="absolute top-[0px] left-[0px] rounded-lg bg-[#D9D9D9] w-[99px] h-9" />
                <div className="absolute top-[7px] left-[16px] leading-[110%] font-medium flex items-center w-[71px] h-6 opacity-[0.5]">
                  RIGHT SIDE
                </div>
              </div>
              <div className="absolute top-[215px] left-[487px] w-[99px] h-9 text-center font-inter">
                <div className="absolute top-[0px] left-[0px] rounded-lg bg-[#D9D9D9] w-[99px] h-9" />
                <div className="absolute top-[7px] left-[14px] leading-[110%] font-medium flex items-center justify-center w-[71px] h-6 opacity-[0.5]">
                  LEFT SIDE
                </div>
              </div>
              <div className="absolute h-[59.5%] w-[46.09%] top-[33.83%] right-[44.34%] bottom-[6.67%] left-[9.57%] max-w-full overflow-hidden max-h-full">
                <Image
                  className="absolute h-[59.5%] w-[46.09%] top-[33.83%] right-[44.34%] bottom-[6.67%] left-[9.57%] max-w-full overflow-hidden max-h-full"
                  id="imageIllustrate"
                  fill={true}
                  alt=""
                  src={dynamicProps.img}
                />
              </div>
            </div>
            {showTestPage && <CanvasAnimationPage />}
        </>
      )}

      {mainPage === 2 && (
        <>
        
            <b className="absolute top-[56px] left-center text-xl text-darkslategray-300">
              7 Lead ECG Test
            </b>
            <div className="absolute  top-0 left-0 right-0 bottom-0 mx-auto justify-center flex items-center w-[1024px] h-[600px]  text-left text-xs text-black font-manrope">
              <div className="absolute top-[122px] left-[40px] w-[944px] h-[49.3px] flex justify-around items-center">
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 1
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c1
                            ? dynamicProps.c1
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V1
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 2
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c2
                            ? dynamicProps.c2
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V2
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 3
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c3
                            ? dynamicProps.c3
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V3
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 4
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c4
                            ? dynamicProps.c4
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V4
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 5
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c5
                            ? dynamicProps.c5
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V5
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 6
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c6
                            ? dynamicProps.c6
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V6
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 7
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c7
                            ? dynamicProps.c7
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  II
                </div>
              </div>

              <button
                className="cursor-pointer [border:none] p-0 bg-[transparent] absolute top-[502px] left-[803px] w-[181px] h-[58px]"
                id="StartButton"
                onClick={handleStartTest}
              >
                <div className="absolute top-[0px] left-[0px] w-[181px] h-[58px]">
                  <div className="absolute top-[0px] left-[0px] rounded-lg bg-[#1AB58F] shadow-[0px_10px_20px_rgba(7,_46,_62,_0.16)] w-[181px] h-[58px]" />
                  <b className="absolute top-[15px] left-[32px] text-xl flex font-manrope text-white text-center items-center justify-center w-[118px] h-7">{`Start test  >`}</b>
                </div>
              </button>
              <div className="absolute top-[215px] left-[73px] w-[99px] h-9 font-inter">
                <div className="absolute top-[0px] left-[0px] rounded-lg bg-[#D9D9D9] w-[99px] h-9" />
                <div className="absolute top-[7px] left-[16px] leading-[110%] font-medium flex items-center w-[71px] h-6 opacity-[0.5]">
                  RIGHT SIDE
                </div>
              </div>
              <div className="absolute top-[215px] left-[487px] w-[99px] h-9 text-center font-inter">
                <div className="absolute top-[0px] left-[0px] rounded-lg bg-[#D9D9D9] w-[99px] h-9" />
                <div className="absolute top-[7px] left-[14px] leading-[110%] font-medium flex items-center justify-center w-[71px] h-6 opacity-[0.5]">
                  LEFT SIDE
                </div>
              </div>
              <div className="absolute h-[59.5%] w-[46.09%] top-[33.83%] right-[44.34%] bottom-[6.67%] left-[9.57%] max-w-full overflow-hidden max-h-full">
                <Image
                  className="absolute h-[59.5%] w-[46.09%] top-[33.83%] right-[44.34%] bottom-[6.67%] left-[9.57%] max-w-full overflow-hidden max-h-full"
                  id="imageIllustrate"
                  fill={true}
                  alt=""
                  src={dynamicProps.img}
                />
              </div>
            </div>
            {showTestPage && <CanvasAnimationPage />}
        </>
      )}

      {mainPage === 3 && (
       <>
            <b className="absolute top-[56px] left-center text-xl text-darkslategray-300">
              12 Lead ECG Test
            </b>
            <div className="absolute  top-0 left-0 right-0 bottom-0 mx-auto justify-center flex items-center w-[1024px] h-[600px]  text-left text-xs text-black font-manrope">
              <div className="absolute top-[122px] left-[40px] w-[944px] h-[49.3px] flex justify-around items-center">
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 1
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c1
                            ? dynamicProps.c1
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V1
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 2
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c2
                            ? dynamicProps.c2
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V2
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 3
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c3
                            ? dynamicProps.c3
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V3
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 4
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c4
                            ? dynamicProps.c4
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V4
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 5
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c5
                            ? dynamicProps.c5
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V5
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 6
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c6
                            ? dynamicProps.c6
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  V6
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 7
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c7
                            ? dynamicProps.c7
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  II
                </div>
                <div
                  className={`relative w-[49.3px] h-[49.3px] rounded-full ${
                    sequenceNumber > 8
                      ? "bg-[#1AB58F] text-white"
                      : `${
                          dynamicProps.c8
                            ? dynamicProps.c8
                            : "bg-[#F2F7F9] text-black"
                        }`
                  } flex items-center justify-center font-semibold`}
                >
                  I
                </div>
              </div>

              <button
                className="cursor-pointer [border:none] p-0 bg-[transparent] absolute top-[502px] left-[803px] w-[181px] h-[58px]"
                id="StartButton"
                onClick={handleStartTest}
              >
                <div className="absolute top-[0px] left-[0px] w-[181px] h-[58px]">
                  <div className="absolute top-[0px] left-[0px] rounded-lg  shadow-[0px_10px_20px_rgba(7,_46,_62,_0.16)] w-[181px] bg-[#1AB58F] h-[58px]" />
                  <b className="absolute top-[15px] left-[32px] text-xl flex font-manrope text-white text-center items-center justify-center w-[118px] h-7">{`Start test  >`}</b>
                </div>
              </button>
              <div className=" h-9 absolute top-[215px] left-[73px] w-[99px] font-inter">
                <div className="absolute top-[0px] left-[0px] rounded-lg bg-[#D9D9D9] w-[99px] h-9" />
                <div className="absolute top-[7px] left-[16px] leading-[110%] font-medium flex items-center w-[71px] h-6 opacity-[0.5]">
                  RIGHT SIDE
                </div>
              </div>
              <div className="absolute top-[215px] left-[487px] w-[99px] h-9 text-center font-inter">
                <div className="absolute top-[0px] left-[0px] rounded-lg bg-[#D9D9D9] w-[99px] h-9" />
                <div className="absolute top-[7px] left-[14px] leading-[110%] font-medium flex items-center justify-center w-[71px] h-6 opacity-[0.5]">
                  LEFT SIDE
                </div>
              </div>
              <div className="absolute h-[59.5%] w-[46.09%] top-[33.83%] right-[44.34%] bottom-[6.67%] left-[9.57%] max-w-full overflow-hidden max-h-full">
                <Image
                  className="absolute h-[59.5%] w-[46.09%] top-[33.83%] right-[44.34%] bottom-[6.67%] left-[9.57%] max-w-full overflow-hidden max-h-full"
                  id="imageIllustrate"
                  fill={true}
                  alt=""
                  src={dynamicProps.img}
                />
              </div>
            </div>
            {showTestPage && <CanvasAnimationPage />}
        </>
      )}

      {mainPage === 4 && (
        <>
         
            <b className="absolute top-[56px] left-center text-xl text-darkslategray-300">
              ECG Test
            </b>
            <div className="w-screen h-screen flex items-center justify-center">
              <div className="flex flex-row justify-center items-center space-x-20">
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold py-6 px-12 rounded-2xl">
                  Result
                </button>
              </div><div className="absolute top-[400px] left-[200px]">{v1}</div>
              <div className="absolute top-[410px] left-[200px]">{v2}</div>
              <div className="absolute top-[420px] left-[200px]">{v3}</div>
              <div className="absolute top-[430px] left-[200px]">{v4}</div>
              <div className="absolute top-[450px] left-[200px]">{v5}</div>
              <div className="absolute top-[460px] left-[200px]">{v6}</div>
              <div className="absolute top-[470px] left-[200px]">{vii}</div>
              <div className="absolute top-[480px] left-[200px]">{vi}</div>
              </div>
        </>
      )}
        </div>
    </>
  );
};

export default EcgPopupFrame;
