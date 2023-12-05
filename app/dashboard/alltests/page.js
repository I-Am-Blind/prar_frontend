"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
//Assets Import
import left_arrow from "@/public/assets/left_small_arrow_white.svg";
import right_arrow from "@/public/assets/right_arrow_blue.svg"
import ecg from "@/public/assets/sensors/ecg.svg"
import bg from "@/public/assets/sensors/bg.svg"
import sthetho from "@/public/assets/sensors/stetho.svg"
import hr from "@/public/assets/sensors/hr.svg"
import bp from "@/public/assets/sensors/bp.svg"
import bt from "@/public/assets/sensors/bt.svg"
import ent from "@/public/assets/sensors/ent.svg"
//Assets Import



export default function Page() {
  const router = useRouter();
  const buttonLayout = (sensor,img,url)=>{
    return (
     <button className="card-1 px-6 flex justify-between  items-center w-96 h-20 " onClick={()=>{router.push(url)}}>
      <span className="flex justify-center items-center gap-4">
        <Image src={img} alt={url} />
        <span className="text-lg font-bold text-primtext">{sensor}</span>
      </span>
      <Image src={right_arrow} alt='test' />
      </button>
    )
   }


  return (
    <main className="h-screen w-screen py-8 px-4 flex flex-col justify-around">
      <Button
        className="flex  justify-center items-center gap-2 w-28 "
        onClick={() => router.back()}
      >
        <Image src={left_arrow} className="h-4" />
        <h2>All Tests</h2>
      </Button>
      <div className="w-full flex  flex-wrap gap-y-4 gap-x-8  justify-center items-center">
        {buttonLayout("ECG",ecg,'/dashboard/alltests/ecg')}
        {buttonLayout("Blood Glucose",bg,'/dashboard/alltests/bloodglucose')}
        {buttonLayout("Heart Rate",hr,'/dashboard/alltests/heartrate')}
        {buttonLayout("Digital Stethoscope",sthetho,'/dashboard/alltests/stethoscope')}
        {buttonLayout("Blood Pressure",bp,'/dashboard/alltests/bloodpressure')}
        {buttonLayout("Body Temperature",bt,'/dashboard/alltests/temperature')}
        {buttonLayout("ENT",ent,'/dashboard/alltests/ent')}
      </div>
    </main>
  );
}
