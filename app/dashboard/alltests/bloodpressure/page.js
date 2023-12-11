"use client";

import { useContext, useEffect } from "react";
import UserDataContext from '@/Context/UserDataContext'
import SensorPopup from '@/components/sensors/SensorPopup'
import {instructions} from '@/Config/Instructions'

export default function Page() {
  const { userdata, updateUserData, datamanager } = useContext(UserDataContext);

  return (
    <main className="h-screen w-screen p-8 flex justify-center items-center ">
      <SensorPopup heading='How to record Blood Pressure' sensortype='bp' instructions={instructions['bp']} />
    </main>
  );
}
