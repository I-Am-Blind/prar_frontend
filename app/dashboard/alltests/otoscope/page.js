"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";

export default function CameraPage() {
  const [recordingState, setRecordingState] = useState("inactive"); // 'inactive', 'recording', 'paused'
  const [recordedVideoURL, setRecordedVideoURL] = useState("");
  const videoRef = useRef(null);
  const recordedChunks = useRef([]);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Failed to get media stream:", err);
      }
    }

    enableStream();
  }, []);

  const handleRecording = () => {
    switch (recordingState) {
      case "inactive":
        startRecording();
        break;
      case "recording":
        pauseRecording();
        break;
      case "paused":
        resumeRecording();
        break;
      default:
        break;
    }
  };

  const startRecording = () => {
    recordedChunks.current = [];
    mediaRecorderRef.current = new MediaRecorder(videoRef.current.srcObject);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedVideoURL(url);
      setRecordingState("inactive");
    };

    mediaRecorderRef.current.start();
    setRecordingState("recording");
  };

  const pauseRecording = () => {
    mediaRecorderRef.current.pause();
    setRecordingState("paused");
  };

  const resumeRecording = () => {
    mediaRecorderRef.current.resume();
    setRecordingState("recording");
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const getRecordingButtonText = () => {
    switch (recordingState) {
      case "inactive":
        return "Start Recording";
      case "recording":
        return "Pause Recording";
      case "paused":
        return "Resume Recording";
      default:
        return "Start Recording";
    }
  };

  useEffect(() => {
    console.log(recordedVideoURL);
  }, [recordedVideoURL]);

  return (
    <>
      {recordedVideoURL ? (
        <div className="w-screen h-screen flex flex-col gap-12 justify-center items-center">
          <h2 className="border-[1px] rounded-xl py-1 px-4 shadow-lg shadow-gray-200">Recorded Video</h2>
          <video src={recordedVideoURL} controls className="w-[60%] rounded-2xl  shadow-xl shadow-slate-300"></video>
          <Button
              className="w-40 shadow-lg shadow-slate-200"
            >
              Submit
            </Button>
        </div>
      ) : (
        <div className="w-screen h-screen flex flex-col gap-12 justify-center items-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-[60%] rounded-2xl  shadow-xl shadow-slate-300"
          ></video>
          <div className="flex  gap-4">
            <Button
              className="w-40 shadow-lg shadow-blue-200"
              onClick={handleRecording}
            >
              {getRecordingButtonText()}
            </Button>
            <Button
              className="w-40 shadow-lg shadow-red-200"
              onClick={stopRecording}
              disabled={recordingState === "inactive"}
              variant={"destructive"}
            >
              Stop Recording
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
