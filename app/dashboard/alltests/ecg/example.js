'use client'
import Image from 'next/image';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from "react";

const CanvasAnimationPage = dynamic(
  () => import('./ecg'), // replace './ecg' with the path to your component
  { ssr: false }
);

const EcgPopupFrame = (props) => {
  const [showTestPage, setShowTestPage] = useState(false);
  const [sequenceNumber, setSequenceNumber] = useState(1);
  const [dynamicProps, setDynamicProps] = useState({});
  const [optionSelected, setOptionSelected] = useState(null);
  const [mainPage, setMainPage] = useState(false);


  useEffect(() => {
    setDynamicProps({
      img: `/vector-1886-${sequenceNumber}.svg`,
      onExitClick: () => {/* Define exit click handler here if needed */},
      onContinueClick: () => {
        const nextSequence = sequenceNumber + 1;
        if (nextSequence <= 8) {
          setSequenceNumber(nextSequence);
        } else {
          // Handle the case where the sequence is greater than 8
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

  const isActive = (lead) => {
    switch (optionSelected) {
      case 1:
        return lead === 'II';
      case 2:
        return lead !== 'I';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderLeadCircle = (lead) => {
    const dynamicColor = dynamicProps[`c${lead.replace(/[^\d]/g, '')}`];
    return (
      <div className={`relative w-[49.3px] h-[49.3px] rounded-full flex items-center justify-center font-semibold ${
        isActive(lead) ? 'bg-[#1AB58F] text-white' : `${dynamicColor ? dynamicColor : 'bg-[#F2F7F9] text-black'}`
      }`}>
        {lead}
      </div>
    );
  };

  const selectOption = (option) => {
    setOptionSelected(option);
    setMainPage(true);  // This will hide the selection page and show the ECG test page
  };


  return (
    <div className="relative justify-center flex items-center w-full h-full text-left text-xs text-black font-manrope">
      {/* Selection Page */}
      {!mainPage && (
        <div className="flex flex-col items-center">
          <button onClick={() => setOptionSelected(1)}>Option 1</button>
          <button onClick={() => setOptionSelected(2)}>Option 2</button>
          <button onClick={() => setOptionSelected(3)}>Option 3</button>
        </div>
      )}

      {/* ECG Popup */}
      {mainPage && (
        <>
          <div className="absolute top-[122px] left-[40px] w-[944px] h-[49.3px] flex justify-around items-center">
            {['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'II', 'I'].map(lead => renderLeadCircle(lead))}
          </div>
          
          {/* Start Test Button */}
          <button className="cursor-pointer p-0 bg-transparent absolute top-[502px] left-[803px] w-[181px] h-[58px]" onClick={handleStartTest}>
            <div className="absolute top-0 left-0 w-[181px] h-[58px]">
              <div className="absolute top-0 left-0 rounded-lg bg-[#1AB58F] shadow-[0px_10px_20px_rgba(7,_46,_62,_0.16)] w-[181px] h-[58px]" />
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

          <CanvasAnimationPage />
        </>
      )}
    </div>
  );
};

export default EcgPopupFrame;