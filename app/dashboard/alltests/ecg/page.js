'use client'
import Image from 'next/image'
import React, { useState, useEffect } from "react";
import CanvasAnimationPage from './ecg'; // Replace with your actual component path

const EcgPopupFrame = (props) => {

  const [showTestPage, setShowTestPage] = useState(false);
  const [sequenceNumber, setSequenceNumber] = useState(1);
  const [dynamicProps, setDynamicProps] = useState({});

  useEffect(() => {
    // Update dynamic properties based on the sequence number
    setDynamicProps({
      [`c${sequenceNumber}`]: "bg-[#FBC60C]",
      img: `/vector-1886-${sequenceNumber}.svg`,
      onExitClick: () => {/* Define exit click handler here if needed */},
      onContinueClick: () => {
        const nextSequence = sequenceNumber + 1;
        if (nextSequence <= 8) {
          setSequenceNumber(nextSequence);
        } else {
          // Handle the case where the sequence is greater than 8, if needed
        }
      }
    });
  }, [sequenceNumber]);

 const handleStartTest = () => {
    setShowTestPage(true);
    setSequenceNumber(prevSequenceNumber => prevSequenceNumber + 1);

  };


  useEffect(() => {
    if (showTestPage) {
      const timer = setTimeout(() => {
        setShowTestPage(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [showTestPage]);

    return (
    <div className="relative  justify-center flex items-center w-full h-full  text-left text-xs text-black font-manrope ">
  
        <div className="absolute top-[32px] left-[0px] bg-[#FAFAFA] w-[100%] h-[75px]" />
        <button className="cursor-pointer [border:none] p-0 bg-[transparent] absolute top-[56px] left-[17px] w-[81px] h-[27px]" onClick={setDynamicProps.onExitClick }>
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
        <b className="absolute top-[56px] left-center text-xl text-darkslategray-300">
          12 Lead ECG Test
        </b>
        <div className="absolute  top-0 left-0 right-0 bottom-0 mx-auto justify-center flex items-center w-[1024px] h-[600px]  text-left text-xs text-black font-manrope">
        <div className="absolute top-[122px] left-[40px] w-[944px] h-[49.3px] text-center">
          <div className="absolute top-[0px] left-[127.8px] w-[49.3px] h-[49.3px]">
          <div className={`  absolute top-[0px] left-[0px] rounded-[50%] ${sequenceNumber > 2 ? 'bg-[#1AB58F] text-white' : (dynamicProps.c2 ? dynamicProps.c2 : 'bg-[#F2F7F9]')} w-[49.3px] h-[49.3px]`} />
            <div className={`absolute top-[13.3px] left-[14.6px]  font-semibold flex items-center  ${sequenceNumber > 2 ? ' text-white': 'text-black'} justify-center w-5 h-[21.3px]`}>
              V2
            </div>
          </div>
          <div className="absolute top-[0px] left-[0px] w-[49.3px] h-[49.3px]">
            <div className={`  absolute top-[0px] left-[0px] rounded-[50%] ${sequenceNumber > 1 ? 'bg-[#1AB58F]' : (dynamicProps.c1 ? dynamicProps.c1 : 'bg-[#F2F7F9]')} w-[49.3px] h-[49.3px]`}  />
            <div className={`absolute top-[13.3px] left-[14.6px]  font-semibold flex items-center  ${sequenceNumber > 1 ? ' text-white': 'text-black'} justify-center w-5 h-[21.3px]`}>
              V1
            </div>
          </div>
          <div className="absolute top-[0px] left-[255.6px] w-[49.3px] h-[49.3px]">
          <div className={`  absolute top-[0px] left-[0px] rounded-[50%]  ${sequenceNumber > 3 ? 'bg-[#1AB58F]' : (dynamicProps.c3 ? dynamicProps.c3 : 'bg-[#F2F7F9]')} w-[49.3px] h-[49.3px]`}  />
          <div className={`absolute top-[13.3px] left-[14.6px]  font-semibold flex items-center  ${sequenceNumber > 3 ? ' text-white': 'text-black'} justify-center w-5 h-[21.3px]`}>
              V3
            </div>
          </div>
          <div className="absolute top-[0px] left-[383.5px] w-[49.3px] h-[49.3px]">
            <div className={`  absolute top-[0px] left-[0px] rounded-[50%]  ${sequenceNumber > 4 ? 'bg-[#1AB58F]' : (dynamicProps.c4 ? dynamicProps.c4 : 'bg-[#F2F7F9]')} w-[49.3px] h-[49.3px]`} />
            <div className={`absolute top-[13.3px] left-[14.6px]  font-semibold flex items-center  ${sequenceNumber > 4 ? ' text-white': 'text-black'} justify-center w-5 h-[21.3px]`}>
              V4
            </div>
          </div>
          <div className="absolute top-[0px] left-[511.3px] w-[49.3px] h-[49.3px]">
            <div className={`  absolute top-[0px] left-[0px] rounded-[50%]  ${sequenceNumber > 5 ? 'bg-[#1AB58F]' : (dynamicProps.c5 ? dynamicProps.c5 : 'bg-[#F2F7F9]')} w-[49.3px] h-[49.3px]`} />
            <div className={`absolute top-[13.3px] left-[14.6px]  font-semibold flex items-center  ${sequenceNumber > 5 ? ' text-white': 'text-black'} justify-center w-5 h-[21.3px]`}>
              V5
            </div>
          </div>
          <div className="absolute top-[0px] left-[639.1px] w-[49.3px] h-[49.3px]">
            <div className={`  absolute top-[0px] left-[0px] rounded-[50%]  ${sequenceNumber > 6 ? 'bg-[#1AB58F]' : (dynamicProps.c6 ? dynamicProps.c6 : 'bg-[#F2F7F9]')} w-[49.3px] h-[49.3px]`} />
            <div className={`absolute top-[13.3px] left-[14.6px]  font-semibold flex items-center  ${sequenceNumber > 6 ? ' text-white': 'text-black'} justify-center w-5 h-[21.3px]`}>
              V6
            </div>
          </div>
          <div className="absolute top-[0px] left-[894.7px] w-[49.3px] h-[49.3px]">
          <div className={`  absolute top-[0px] left-[0px] rounded-[50%]  ${sequenceNumber > 8 ? 'bg-[#1AB58F]' : (dynamicProps.c8 ? dynamicProps.c8 : 'bg-[#F2F7F9]')} w-[49.3px] h-[49.3px]`}  />
          <div className={`absolute top-[13.3px] left-[14.6px]  font-semibold flex items-center  ${sequenceNumber > 8 ? ' text-white': 'text-black'} justify-center w-5 h-[21.3px]`}>
              I
            </div>
          </div>
          <div className="absolute top-[0px] left-[766.9px] w-[49.3px] h-[49.3px]">
            <div className={`  absolute top-[0px] left-[0px] rounded-[50%]  ${sequenceNumber > 7 ? 'bg-[#1AB58F]' : (dynamicProps.c7 ? dynamicProps.c7 : 'bg-[#F2F7F9]')} w-[49.3px] h-[49.3px]`} />
            <div className={`absolute top-[13.3px] left-[14.6px]  font-semibold flex items-center  ${sequenceNumber > 7 ? ' text-white': 'text-black'} justify-center w-5 h-[21.3px]`}>
              II
            </div>
          </div>
        </div>
        <button
          className="cursor-pointer [border:none] p-0 bg-[transparent] absolute top-[502px] left-[803px] w-[181px] h-[58px]"
          id="StartButton"      onClick={handleStartTest}

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
        <div          
        className="absolute h-[59.5%] w-[46.09%] top-[33.83%] right-[44.34%] bottom-[6.67%] left-[9.57%] max-w-full overflow-hidden max-h-full" >
        <Image
          className="absolute h-[59.5%] w-[46.09%] top-[33.83%] right-[44.34%] bottom-[6.67%] left-[9.57%] max-w-full overflow-hidden max-h-full"
          id="imageIllustrate"
          fill={true}
          alt=""
          src={dynamicProps.img}
        />
        </div>
              </div>

    </div>
    );
  };
  
  export default EcgPopupFrame;
  
  