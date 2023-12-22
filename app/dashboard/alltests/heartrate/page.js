"use client";

import HrSensorPopup from '@/components/sensors/HrSensorPopup'
import {instructions, sensor_images} from '@/Config/Instructions'
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const { toast } = useToast()
  return (
    <main className="h-screen w-screen">
      <HrSensorPopup heading='How to record Heart rate and Spo2'  instructions={instructions['hr']} sensor_images={sensor_images['hr']} toast={toast} />
    </main>
  );
}
