import React, { useEffect, useRef, useState } from 'react';
import { SmoothieChart, TimeSeries } from 'smoothie';
import socket from './socket.js'; // Adjust the import path as necessary

export default function CanvasAnimationPage() {
    const canvasRef = useRef(null);
    const [isSensorOn, setIsSensorOn] = useState(false);
    const ecgTimeSeries = new TimeSeries();

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
        <div>
            <canvas 
                ref={canvasRef} 
                width="800" 
                height="300" 
                style={{ }}
            ></canvas>
            <br />
            <button onClick={toggleSensor}>
                {isSensorOn ? 'Stop Sensor' : 'Start Sensor'}
            </button>
            <p>Simulate input signal by moving the mouse over the canvas</p>
            <style jsx>{`
                body {
                    background-color: ivory;
                }
                canvas {
                    border: 1px solid red;
                }
            `}</style>
        </div>
    );
}
