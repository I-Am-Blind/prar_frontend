"use client"
import { useRouter } from 'next/navigation';
import Image from "next/image";

import React, { useState, useEffect } from 'react';

import { JaaSMeeting } from '@jitsi/react-sdk';

import io from 'socket.io-client';

import BgSensorPopup from '@/components/sensors/BgSensorPopup'
import BpSensorPopup from '@/components/sensors/BpSensorPopup'
import HrSensorPopup from '@/components/sensors/HrSensorPopup'
import {instructions, sensor_images} from '@/Config/Instructions'
import { useToast } from "@/components/ui/use-toast";


export default function Home() {
    const [token, setToken] = useState('');
    const [joinCall, setJoinCall] = useState(false);
    const [joinAudio, setJoinAudio] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const router = useRouter();
    const [currentPopup, setCurrentPopup] = useState(null);
    const [popupQueue, setPopupQueue] = useState([]);
    const [showBloodPressurePopup, setShowBloodPressurePopup] = useState(false);
    const { toast } = useToast()

    
    useEffect(() => {
      const socket = io('https://ausa-tele-socket-server-production.up.railway.app/');
      socket.on('connect', () => {
          console.log('Connected to the server');
          socket.emit('message', 'Hello Server!');
      });
      socket.on('message', (message) => {
        console.log(message);
        if (Array.isArray(message)) {
            setPopupQueue(message);
        }
    });

      return () => {
          console.log('Disconnecting socket...');
          socket.disconnect();
      };
  }, []);

  useEffect(() => {
    if (popupQueue.length > 0 && !currentPopup) {
        setCurrentPopup(popupQueue[0]);
    }
}, [popupQueue, currentPopup]);



useEffect(() => {
  if (joinCall) {
    closeCurrentPopup();
  }
}, [joinCall]); // Dependency array, so the effect runs whenever joinCall changes

useEffect(() => {
  if (joinAudio) {
    closeCurrentPopup();
  }
}, [joinAudio]); // Dependency array, so the effect runs whenever joinCall changes


const closeCurrentPopup = () => {
    setCurrentPopup(null);
    setPopupQueue(prevQueue => prevQueue.slice(1));
};





    const handleChatUpdated = (eventData) => {
        setIsChatOpen(eventData.isOpen);
      };
  

    useEffect(() => {
        fetch('/api/generateToken')
          .then(response => response.json())
          .then(data => setToken(data.token));
          console.log(token)
      }, []);  
      
      const navigateOnHangup = () => {
        router.push('/dashboard');
      };

      return (
          <main className="flex w-full h-screen items-center flex-col bg-[#D9D9D9] justify-start">
          <div className="relative flex top-8 h-screen-minus-2rem w-full">
            <JaaSMeeting
              appId="vpaas-magic-cookie-cd58d83d6bb247d893d484da00e00493"
              roomName="Ausa Clinic"
              jwt={token}
              onApiReady={(externalApi) => {
                externalApi.addEventListeners({
                  videoConferenceLeft: navigateOnHangup,
                  readyToClose: navigateOnHangup,
                  chatUpdated:handleChatUpdated
                });
              }}
              configOverwrite={{
                toolbarButtons: [ 'chat','microphone', 'camera', 'hangup'], 
                disableThirdPartyRequests: true,
                disableLocalVideoFlip: true,
                disablePolls: true,
                prejoinPageEnabled: false,
                backgroundAlpha: 0.5,
                isChatOpen: 20
              }}
              interfaceConfigOverwrite={{
                VIDEO_LAYOUT_FIT: 'nocrop',
                MOBILE_APP_PROMO: false,
                TILE_VIEW_MAX_COLUMNS: 4
              }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.borderRadius = "20px !important";
                iframeRef.style.height = "100%";
                iframeRef.style.width = "100%";        
              }}
            />
          </div>

         <div className={`absolute items-start  right-[18rem]  ${isChatOpen ? 'bottom-[5.3rem] ' : 'bottom-[1rem]'} `}>
         <button onClick={() => {setJoinCall(!joinCall) ; if(!joinCall){closeCurrentPopup ;}}} className={`w-[70px] h-[70px] rounded-full border-none font-semibold flex flex-col items-center justify-center shadow-lg overflow-hidden relative gap-0.5 ${joinCall ? 'bg-[#BC0C0C] opacity-70' : 'bg-black opacity-70'} `}>
         <svg width="35" height="33" viewBox="0 0 518 518" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M175.669 41.0879L166.739 17.7349L166.451 17.8492L175.669 41.0879ZM169.702 43.4545L160.484 20.2132L160.133 20.3582L169.702 43.4545ZM293.001 316.386L305.755 337.893L306.001 337.743L293.001 316.386ZM44.2164 115.498C-26.5482 221.39 -9.57625 363.06 84.1994 449.24L118.032 412.427C42.4071 342.923 28.7201 228.677 85.7884 143.278L44.2164 115.498ZM84.1994 449.24C177.975 535.423 320.568 540.4 420.125 460.963L388.941 421.88C308.655 485.94 193.658 481.927 118.032 412.427L84.1994 449.24ZM420.125 460.963C519.678 381.53 546.488 241.39 483.275 130.82L439.868 155.636C490.845 244.803 469.225 357.82 388.941 421.88L420.125 460.963ZM483.275 130.82C420.065 20.2508 285.701 -27.7525 166.739 17.7349L184.598 64.4389C280.535 27.7555 388.891 66.4665 439.868 155.636L483.275 130.82ZM166.451 17.8492L160.484 20.2132L178.92 66.6932L184.886 64.3265L166.451 17.8492ZM160.133 20.3582C112.937 39.9125 72.5984 73.0199 44.2164 115.498L85.7884 143.278C108.677 109.022 141.209 82.3202 179.271 66.5505L160.133 20.3582ZM217.335 259.02C217.335 239.143 231.378 222.033 250.875 218.153L241.121 169.115C198.228 177.646 167.335 215.29 167.336 259.023L217.335 259.02ZM250.875 218.153C270.371 214.277 289.891 224.71 297.498 243.077L343.691 223.947C326.958 183.54 284.015 160.583 241.121 169.115L250.875 218.153ZM297.498 243.077C305.105 261.443 298.678 282.623 282.148 293.667L309.901 335.256C346.265 310.963 360.428 264.35 343.691 223.947L297.498 243.077ZM282.148 293.667C281.431 294.143 280.731 294.59 280.005 295.033L306.001 337.743C307.318 336.94 308.618 336.113 309.901 335.256L282.148 293.667ZM280.251 294.883C267.371 302.52 251.381 302.66 238.371 295.243L213.618 338.687C242.238 354.997 277.418 354.693 305.755 337.893L280.251 294.883ZM238.371 295.243C225.361 287.83 217.331 273.993 217.335 259.02L167.336 259.023C167.325 291.967 184.994 322.373 213.618 338.687L238.371 295.243Z" fill="white"/>
<path d="M430.758 73.9438C428.582 60.3095 415.762 51.0232 402.128 53.2018C388.495 55.3808 379.208 68.1995 381.385 81.8338L430.758 73.9438ZM280.435 294.78C268.498 301.724 264.455 317.027 271.398 328.96C278.342 340.894 293.645 344.94 305.578 337.997L280.435 294.78ZM505.175 315.087C515.888 306.38 517.515 290.634 508.805 279.92C500.098 269.207 484.352 267.58 473.638 276.287L505.175 315.087ZM238.162 295.097C226.202 288.2 210.912 292.307 204.015 304.267C197.118 316.227 201.222 331.514 213.185 338.414L238.162 295.097ZM87.2854 444.03C89.4614 457.664 102.279 466.954 115.913 464.777C129.548 462.6 138.837 449.784 136.66 436.147L87.2854 444.03ZM237.582 223.26C249.515 216.314 253.558 201.01 246.612 189.078C239.665 177.146 224.362 173.103 212.428 180.049L237.582 223.26ZM217.338 259.02C217.338 245.214 206.145 234.02 192.338 234.02C178.531 234.024 167.339 245.217 167.339 259.024L217.338 259.02ZM333.412 500.307C346.308 505.237 360.758 498.78 365.692 485.884C370.622 472.987 364.165 458.534 351.268 453.604L333.412 500.307ZM184.601 17.7375C171.705 12.8065 157.253 19.2635 152.322 32.1602C147.39 45.0568 153.848 59.5088 166.744 64.4398L184.601 17.7375ZM300.672 259.024C300.675 272.83 311.868 284.024 325.675 284.02C339.482 284.02 350.675 272.827 350.672 259.02L300.672 259.024ZM12.8378 202.954C2.12343 211.664 0.497774 227.41 9.20644 238.124C17.9148 248.837 33.6604 250.464 44.3748 241.754L12.8378 202.954ZM279.852 222.947C291.812 229.844 307.098 225.737 313.995 213.777C320.895 201.817 316.788 186.529 304.828 179.631L279.852 222.947ZM381.385 81.8338C394.972 166.857 354.855 251.48 280.435 294.78L305.578 337.997C397.862 284.304 447.608 179.373 430.758 73.9438L381.385 81.8338ZM473.638 276.287C406.628 330.754 312.965 338.234 238.162 295.097L213.185 338.414C305.942 391.904 422.085 382.624 505.175 315.087L473.638 276.287ZM136.66 436.147C123.094 351.15 163.195 266.564 237.582 223.26L212.428 180.049C120.188 233.744 70.4634 338.634 87.2854 444.03L136.66 436.147ZM167.339 259.024C167.345 366.094 233.402 462.067 333.412 500.307L351.268 453.604C270.615 422.764 217.345 345.37 217.338 259.02L167.339 259.024ZM166.744 64.4398C247.398 95.2788 300.668 172.675 300.672 259.024L350.672 259.02C350.668 151.949 284.612 55.9775 184.601 17.7375L166.744 64.4398ZM44.3748 241.754C111.383 187.29 205.045 179.809 279.852 222.947L304.828 179.631C212.072 126.142 95.9288 135.419 12.8378 202.954L44.3748 241.754Z" fill="white"/>
</svg>
         </button>
        </div>

            <div className='h-0 w-0 overflow-hidden'>
      {joinCall &&   <JaaSMeeting
          appId="vpaas-magic-cookie-cd58d83d6bb247d893d484da00e00493"
          roomName="Ausa Clinic"
          jwt={token}
          configOverwrite={{
            prejoinPageEnabled: false,
            disableThirdPartyRequests: true,
            disableLocalVideoFlip: true,
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            toolbarButtons: [''] ,
            backgroundAlpha: 0.5
          }}
          devices={{
            videoInput: 'Teslong Camera (f007:c999)'
          }}
          interfaceConfigOverwrite={{
            VIDEO_LAYOUT_FIT: 'nocrop',
            MOBILE_APP_PROMO: false,
            TILE_VIEW_MAX_COLUMNS: 4
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.borderRadius = "20px !important";
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";    
          }}
        />}
    </div>  

        <div id='sound' className={`absolute items-start  right-[12rem] ${isChatOpen ? 'bottom-[5.3rem] ' : 'bottom-[1rem]'} `}>
         <button onClick={() => setJoinAudio(!joinAudio) } className={`w-[70px] h-[70px] rounded-full border-none font-semibold flex flex-col items-center justify-center shadow-lg overflow-hidden relative gap-0.5  ${joinAudio ? 'bg-[#BC0C0C] opacity-70' : 'bg-black opacity-70'} `}>
<svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M41.2479 19.8152C41.2462 18.1919 40.6344 16.6355 39.5469 15.4878C38.4592 14.3398 36.9848 13.6941 35.4466 13.6922C28.8817 13.8267 27.4583 23.2745 33.5577 25.598V32.3451C33.1981 41.9141 20.231 41.9055 19.8929 32.3451V28.7648C22.2993 28.2296 24.4591 26.8393 26.0118 24.8264C27.5642 22.8132 28.4151 20.2988 28.423 17.7032V10.6809C28.4209 9.53103 27.9869 8.42935 27.2159 7.61701C26.4452 6.80489 25.4006 6.3483 24.3114 6.34798H22.885C22.1955 4.19564 18.548 4.64516 18.6067 7.04956V9.93479C18.5535 12.4654 22.503 12.7792 22.9592 10.3852H23.5751C23.8954 10.3868 24.2023 10.5222 24.4283 10.762C24.6541 11.0018 24.7809 11.3263 24.7803 11.6643V17.6273C24.4417 27.153 11.5177 27.1593 11.1602 17.6273V11.6643C11.1654 11.2879 11.3237 10.9317 11.5948 10.687C11.866 10.442 12.2238 10.332 12.5772 10.3852C13.0346 12.7809 16.9821 12.4638 16.9297 9.93473V7.0495C16.9873 4.5932 13.2044 4.19312 12.6179 6.46091H10.2449C9.32413 6.65833 8.497 7.18705 7.90439 7.95646C7.31179 8.72621 6.99087 9.68908 6.99616 10.6808V17.7031C6.99761 20.3543 7.88205 22.9202 9.4952 24.9525C11.108 26.9847 13.347 28.3538 15.8198 28.8199V32.1184C15.8198 36.1839 17.8746 39.9406 21.2106 41.9735C24.5466 44.0065 28.6565 44.0061 31.9925 41.9735C35.3282 39.9409 37.3833 36.1843 37.3833 32.1184V25.5795C38.5124 25.157 39.4896 24.3759 40.1817 23.344C40.8735 22.312 41.2461 21.0793 41.2482 19.8152L41.2479 19.8152ZM21.0538 10.6227H20.5613C20.2014 10.6224 19.9099 10.3148 19.9096 9.93497V7.04974C19.9099 6.66993 20.2014 6.36228 20.5613 6.36197H21.0538C21.4137 6.36228 21.7052 6.66993 21.7054 7.04974V9.69091C21.7581 9.9086 21.7153 10.1395 21.5891 10.32C21.4628 10.5009 21.2662 10.612 21.0538 10.6228V10.6227ZM13.8302 7.04974C13.8305 6.66993 14.122 6.36228 14.4819 6.36197H14.9744C15.334 6.36228 15.6258 6.66993 15.6261 7.04974V9.93497C15.6258 10.3148 15.334 10.6224 14.9744 10.6227H14.4819C14.2724 10.612 14.0784 10.5036 13.9524 10.3267C13.8264 10.1499 13.7816 9.923 13.8302 9.70776C13.8247 9.69087 13.834 7.06973 13.8302 7.04977V7.04974ZM8.29919 17.7034V10.6811C8.29832 10.0382 8.49614 9.41242 8.8627 8.89908C9.22927 8.38573 9.7448 8.01269 10.3307 7.8367H12.5268V9.0099C11.8342 8.96845 11.1557 9.22913 10.6507 9.73114C10.1457 10.2331 9.85852 10.9326 9.85651 11.6646V17.6275C10.3083 28.9949 25.6536 28.9862 26.0833 17.6275V11.6646C26.0685 10.858 25.7188 10.0987 25.1271 9.58777C24.5353 9.07686 23.7612 8.86562 23.0089 9.00992V7.72376H24.311C25.0546 7.72376 25.7679 8.0351 26.2945 8.58964C26.8211 9.14415 27.1176 9.89607 27.1193 10.6811V17.7034C27.1193 21.2516 25.3258 24.5301 22.4142 26.304C19.5029 28.078 15.9159 28.078 13.0042 26.304C10.0926 24.53 8.29907 21.2514 8.29907 17.7034L8.29919 17.7034ZM36.0794 32.1189V32.1192C36.0794 35.6929 34.2728 38.9953 31.3403 40.7819C28.4075 42.5688 24.7946 42.5688 21.8618 40.7819C18.9293 38.995 17.1226 35.6925 17.1226 32.1185V28.9903C17.6111 29.021 18.1013 29.0143 18.5889 28.9698V32.3453C19.0247 43.7457 34.4061 43.7449 34.8604 32.3453V25.9064C35.2657 25.95 35.6744 25.9476 36.0791 25.8997L36.0794 32.1189ZM35.4461 24.5627H35.4464C34.2551 24.5572 33.1138 24.0552 32.2716 23.1663C31.4291 22.2771 30.9534 21.0729 30.9481 19.8156C31.1591 13.5336 39.7333 13.5336 39.9441 19.8156H39.9444C39.9429 21.0741 39.4687 22.2808 38.6253 23.1706C37.7823 24.0607 36.6389 24.5611 35.4464 24.5627H35.4461Z" fill="white"/>
<path d="M35.4505 17.1152C34.5416 17.1238 33.7052 17.6403 33.2531 18.4724C32.801 19.3044 32.801 20.3272 33.2531 21.1593C33.7052 21.9914 34.5416 22.5081 35.4505 22.5167C36.3593 22.5081 37.1954 21.9914 37.6475 21.1593C38.0996 20.3272 38.0996 19.3044 37.6475 18.4724C37.1954 17.6403 36.359 17.1239 35.4505 17.1152V17.1152ZM35.4505 21.1411C35.0065 21.1335 34.5995 20.8792 34.3796 20.4724C34.1596 20.0656 34.1596 19.5664 34.3796 19.1592C34.5995 18.7524 35.0065 18.4981 35.4505 18.4908C35.8941 18.4982 36.3014 18.7524 36.5211 19.1592C36.741 19.5663 36.741 20.0656 36.5211 20.4724C36.3014 20.8792 35.8941 21.1335 35.4505 21.1411V21.1411Z" fill="white"/>
</svg>
</button>
        </div>

        
          <div className='h-0 w-0 overflow-hidden'>
      {joinAudio &&   <JaaSMeeting
          appId="vpaas-magic-cookie-cd58d83d6bb247d893d484da00e00493"
          roomName="Ausa Clinic"
          jwt={token}
          configOverwrite={{
            prejoinPageEnabled: false,
            disableThirdPartyRequests: true,
            disableLocalVideoFlip: true,
            startWithAudioMuted: false,
            startWithVideoMuted: true,
            toolbarButtons: [''] ,
            backgroundAlpha: 0.5
          }}
          interfaceConfigOverwrite={{
            VIDEO_LAYOUT_FIT: 'nocrop',
            MOBILE_APP_PROMO: false,
            TILE_VIEW_MAX_COLUMNS: 4
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.borderRadius = "20px !important";
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";    
          }}
        />}
    </div>  
    <div className={`absolute items-start bottom-[15px] left-[15px] w-[203px] h-auto ${isChatOpen ? 'opacity-0 ' : 'opacity-100'}`}>
    <div className=" relative w-[203px] h-[135px] mx-auto text-left text-xs rounded-[10px] bg-[#D3D3D3] opacity-[0.6]  text-darkslategray font-manrope">
    <div className="absolute top-[0px] left-[0px] rounded-3xs bg-lightgray w-[203px] h-[135px] opacity-[0.7]" />
    <div className="absolute top-[9px] left-[16px] leading-[20px] inline-block w-[101px] opacity-[0.6]">
      Consultation with
    </div>
    <b className="absolute top-[30px] left-[16px] text-sm leading-[20px]">
      Dr Adnan Rafiq
    </b>
    <div className="absolute top-[49px] left-[16px] leading-[20px]">
      Dermatologist
    </div>
    <div className="absolute top-[67px] left-[16px] text-[10px] leading-[20px] opacity-[0.6]">
      20 years experience
    </div>
    <div className="absolute top-[104px] left-[16px] leading-[20px] opacity-[0.6]">
      MG Road, Bangalore
    </div>
    <div className="absolute top-[85px] left-[16px] leading-[20px] opacity-[0.6]">{`Dr. Partha’s Hair & Skin Hospital`}</div>
  </div>

  </div>

  {currentPopup === 'Blood Glucose' && (<BgSensorPopup className='z-50' onClose={closeCurrentPopup} heading='How to record Blood Glucose'  instructions={instructions['bg']} sensor_images={sensor_images['bg']} toast={toast}> <button className='absolute z-60 top-[5rem] right-[10rem] bg-[#ffffff] w-[20px] h-[20px]' onClick={closeCurrentPopup}>Close</button></BgSensorPopup>)}
  {currentPopup === 'Blood Pressure' && <BpSensorPopup className='z-50' onClose={closeCurrentPopup} heading='How to record Blood Pressure'  instructions={instructions['bp']} sensor_images={sensor_images['bp']} toast={toast} /> }
  {currentPopup === 'SpO2' && <HrSensorPopup className='z-50' onClose={closeCurrentPopup} heading='How to record Heart rate and Spo2'  instructions={instructions['hr']} sensor_images={sensor_images['hr']} toast={toast} />}
  {currentPopup === 'Stethoscope'? (<><div className={`absolute w-[282px] h-[105.15px] right-[12rem] ${isChatOpen ? 'bottom-[10.3rem] ' : 'bottom-[6rem]'}`}><Image className=' top-0 left-0' width={476}  height={140.2}  src="/StethIn.png"  alt="Picture of the author"/><button  onClick={closeCurrentPopup} className='absolute top-[5px] right-[2px] w-[35px] h-[35px]'></button></div></>) : null}
  {currentPopup === 'ENT Camera' ? (<><div className={`absolute w-[282px] h-[105.15px] right-[18.1rem] ${isChatOpen ? 'bottom-[10.3rem] ' : 'bottom-[6rem]'}`}><Image className=' top-0 left-0' width={476}  height={140.2}  src="/OtoIn.png"  alt="Picture of the author"/><button  onClick={closeCurrentPopup} className='absolute top-[5px] right-[2px] w-[35px] h-[35px]'></button></div></>) : null}
  {currentPopup === 'Blood Glucose' || currentPopup === 'Blood Pressure' || currentPopup === 'SpO2'  ? (<><div className='absolute top-10 right-8 w-[30px] h-[30px] bg-white opacity-50 rounded-[5px] justify-center items-center  '><button onClick={closeCurrentPopup} className='w-full h-full flex flex-row justify-center items-center'><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.9999 3.00007L3 21M2.99992 3L20.9998 20.9999" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
</svg>
</button></div></> ): null}
  {currentPopup === 'Blood' && <IDeal/> }
  {currentPopup === 'Hello' && <IDeal/> }
</main>
      );
    }
        

    // <Image src="/profile.png" width={500}  height={500} alt="Picture of the author"/>


