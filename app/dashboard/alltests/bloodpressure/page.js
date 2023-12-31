"use client";
import BpSensorPopup from '@/components/sensors/BpSensorPopup'
import {instructions, sensor_images} from '@/Config/Instructions'
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const { toast } = useToast()
  return (
    <main className="h-screen w-screen">
      <BpSensorPopup heading='How to record Blood Pressure'  instructions={instructions['bp']} sensor_images={sensor_images['bp']} toast={toast} />
    </main>
  );
}
