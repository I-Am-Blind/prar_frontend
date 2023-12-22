"use client";
import { useContext } from "react";
import UserDataContext from '@/Context/UserDataContext'
import BgSensorPopup from '@/components/sensors/BgSensorPopup'
import {instructions, sensor_images} from '@/Config/Instructions'
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const { userdata, updateUserData, datamanager } = useContext(UserDataContext);
  const { toast } = useToast()
  return (
    <main className="h-screen w-screen">
      <BgSensorPopup heading='How to record Blood Glucose'  instructions={instructions['bg']} sensor_images={sensor_images['bg']} toast={toast} />
    </main>
  );
}
