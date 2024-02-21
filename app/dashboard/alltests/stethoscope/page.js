"use client"

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function RealTimeAudioVisualizer() {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const audioDownloadLinkRef = useRef(null); // Ref for the download link

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
    }
  }, []);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        if (audioContextRef.current && analyserRef.current && canvasRef.current) {
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          drawVisualizer();

          mediaRecorderRef.current = new MediaRecorder(stream);
          recordedChunks.current = []; // Reset the chunks array for a new recording
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunks.current.push(event.data);
            }
          };
          mediaRecorderRef.current.start();
          setIsRecording(true);
          setShowSubmitButton(false); // Hide submit button when recording starts
        }
      })
      .catch(err => console.error("Failed to get media stream:", err));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      cancelAnimationFrame(animationRef.current);
      setShowSubmitButton(true); // Show submit button when recording stops
    }
  };

  // Function to save the recording
  const saveRecording = () => {
    const blob = new Blob(recordedChunks.current, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Drawing function remains unchanged
  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    let drawVisualizerInterval = 100; // Reduce update frequency to slow down the visualization
    let lastDrawTime = Date.now();

    const draw = () => {
      const currentTime = Date.now();
      if (currentTime - lastDrawTime > drawVisualizerInterval) {
        lastDrawTime = currentTime;
        animationRef.current = requestAnimationFrame(draw);
        analyserRef.current.getByteTimeDomainData(dataArray);

        canvasContext.fillStyle = "rgb(255, 255, 255)"; // Light background
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = "#2563eb"; // Dark lines for the waveform
        canvasContext.beginPath();

        let sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
          let v = dataArray[i] / 128.0;
          let y = v * HEIGHT/2;

          if(i === 0) {
            canvasContext.moveTo(x, y);
          } else {
            canvasContext.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasContext.lineTo(canvas.width, canvas.height/2);
        canvasContext.stroke();
      } else {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
  };

  return (
    <main className="flex flex-col gap-2 items-center justify-center h-screen w-screen">
        <h2> {isRecording ? 'Press Stop recording once all the sounds are recorded' : 'Place the stethoscope on your chest and press start recording'}</h2>
      <canvas ref={canvasRef} width="800" height="400" className="rounded-2xl shadow-lg shadow-gray-100"></canvas>
      <Button
        className={`mt-4 px-4 py-2 shadow ${isRecording ? 'bg-red-600' : 'bg-green-600'} text-white font-bold`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      {showSubmitButton && (
        <Button
          className="mt-4 px-4 py-2 bg-blue-600 text-white shadow font-bold"
          onClick={saveRecording} // Call saveRecording when the submit button is clicked
        >
          Submit
        </Button>
      )}
    </main>
  );
}
