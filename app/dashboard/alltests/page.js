"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
//Assets Import
import left_arrow from "@/public/assets/left_small_arrow_black.svg";
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
     <button className="card-1 px-6 flex justify-between  items-center w-96 h-20 " onClick={()=>{router.push('/dashboard/alltests/graph/' + url)}}>
      <span className="flex justify-center items-center gap-4">
        <Image src={img} alt={url} />
        <span className="text-lg font-bold text-primtext">{sensor}</span>
      </span>
      <Image src={right_arrow} alt='test' />
      </button>
    )
   }

   const buttonLayout2 = (sensor,img,url)=>{
    return (
     <button className="card-1 px-6 flex justify-between  items-center w-96 h-20 " onClick={()=>{router.push('/dashboard/alltests/' + url)}}>
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
      <button
        className="flex  justify-center items-center gap-2 w-28 font-bold "
        onClick={() => router.push('/dashboard')}
      >
        <Image src={left_arrow} alt='test' className="h-4" />
        <h2>All Tests</h2>
      </button>
      <div className="w-full flex  flex-wrap gap-y-4 gap-x-8  justify-center items-center">
        {buttonLayout("ECG",ecg,'ecg')}
        {buttonLayout("Blood Glucose",bg,'bg')}
        {buttonLayout("Heart Rate & Spo2",hr,'hr')}
        {buttonLayout2("Digital Stethoscope",sthetho,'stethoscope')}
        {buttonLayout("Blood Pressure",bp,'bp')}
        {buttonLayout("Body Temperature",bt,'t')}
        {buttonLayout2("ENT",ent,'otoscope')}
      </div>
    </main>
  );
}
