"use client";
import { useContext } from "react";
import UserDataContext from '@/Context/UserDataContext'
import TempSensorPopup from '@/components/sensors/TempSensorPopup'
import {instructions, sensor_images} from '@/Config/Instructions'
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const { userdata, updateUserData, datamanager } = useContext(UserDataContext);
  const { toast } = useToast()
  return (
    <main className="h-screen w-screen">
      <TempSensorPopup heading='How to record Body Temperature'  instructions={instructions['t']} sensor_images={sensor_images['t']} toast={toast} />
    </main>
  );
}
