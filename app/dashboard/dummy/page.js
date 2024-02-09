"use client";

import { StoreReadings } from "@/Database/Sensors";
import { UserDataManager } from "@/Config/userManager";
import { useState } from "react";

export default function page() {
  const [sensor, setSensor] = useState("");
  const [reading, setReading] = useState("");
  const userDataManager = new UserDataManager();

  const handleSensorChange = (event) => {
    setSensor(event.target.value);
  };

  const handleReadingChange = (event) => {
    setReading(event.target.value);
  };

  const handleSubmit = async () => {
    const userId = userDataManager.getAll().user?.id;
    try {
      await StoreReadings(userId, sensor, reading);
      alert("Data stored successfully");
    } catch (error) {
      console.error("Error storing data:", error);
      alert("Failed to store data");
    }
  };

  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <form onSubmit={handleSubmit}>
        <label>
          Sensor Type:
          <select value={sensor} onChange={handleSensorChange} required>
            <option value="">Select a sensor</option>
            <option value="bp">Blood Pressure</option>
            <option value="bg">Blood Glucose</option>
            <option value="t">Temperature</option>
            <option value="hr">Heart Rate</option>
            <option value="sp">SpO2</option>
          </select>
        </label>
        <br />
        <label>
          Reading:
          <input
            type="text"
            value={reading}
            onChange={handleReadingChange}
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
