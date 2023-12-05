"use client";

import { getSocket } from "@/Socket/socket";
import { useEffect } from "react";

export default function Page() {

  useEffect(() => {
    const socket = getSocket();
    socket.emit("bpsensor")
    socket.on('sensorData', (data) => {
      console.log('Received sensor data:', data);
  });
  }, []);

  return (
    <main className="h-screen w-screen py-8 px-4 ">
      <div>Hello</div>
    </main>
  );
}
