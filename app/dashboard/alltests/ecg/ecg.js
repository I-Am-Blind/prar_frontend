"use client"

import React, { useEffect, useRef, useState } from 'react';
import { SmoothieChart, TimeSeries } from 'smoothie';
import io from 'socket.io-client';

export default function CanvasAnimationPage() {
    const canvasRef = useRef(null);
    const [isSensorOn, setIsSensorOn] = useState(false);
    const ecgTimeSeries = new TimeSeries();
    const scoket = useRef(null);
    const SOCKET_URL = 'http://localhost:5000';
    const socket = io.connect(SOCKET_URL);
    useEffect(() => {
        const handleEcgData = (receivedData) => {
            // Assuming receivedData.data is a number
            const value = receivedData.data;
            ecgTimeSeries.append(new Date().getTime(), value);
        };
    
        socket.on("ecg_data", handleEcgData);
    
        return () => {
            socket.off("ecg_data", handleEcgData);
        };
    }, []);

    useEffect(() => {
        const chart = new SmoothieChart({millisPerPixel:4,
            grid: { fillStyle:'#ffffff',strokeStyle: 'transparent', verticalSections: 0 , borderVisible:false},
            labels: { disabled:true,intermediateLabelSameAxis:false},
            tooltipLine: { strokeStyle: '#bbbbbb' }});
        chart.addTimeSeries(ecgTimeSeries, { strokeStyle: 'red', lineWidth: 2,  interpolation: 'bezier' });
        chart.streamTo(canvasRef.current);
    }, []);

    const SensorStop = () => {
        socket.emit("send_message_ecg", { message: "Stop" });
    };

    const SensorRead = () => {
        socket.emit("send_message_ecg", { message: "Start" });
    };

    const toggleSensor = () => {
        if (isSensorOn) {
            SensorStop();
        } else {
            SensorRead();
        }
        setIsSensorOn(!isSensorOn);
    };

    return (
<div className="w-screen h-screen relative flex items-center justify-center bg-black bg-opacity-40 z-200">
    
<div className="w-[942.88px] h-[428px] relative flex flex-col  justify-center items-center bg-white rounded-xl z-1000">
            <canvas 
                ref={canvasRef} 
                width="942.88" 
                height="300" 
                style={{ }}
            ></canvas>
            <br />
            <button onClick={toggleSensor}>
                {isSensorOn ? 'Stop Sensor' : 'Start Sensor'}
            </button>
            <style jsx>{`
                body {
                    background-color: ivory;
                }
                canvas {
                    border: 1px solid red;
                }
            `}</style>
            </div>
        </div>
    );
}
