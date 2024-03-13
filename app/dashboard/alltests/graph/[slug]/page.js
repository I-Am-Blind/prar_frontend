"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import right_arrow from "@/public/assets/right_arrow_white.svg";
import left_arrow from "@/public/assets/left_small_arrow_black.svg";
import initiate_test from "@/public/assets/initiate_test.png";
import Image from "next/image";
import SensorChart from "@/components/SensorChart"
import Link from "next/link";


export default function Page({ params }) {
  const router = useRouter();
  const slugtourl = {
    bp: "bloodpressure",
    bg: "bloodglucose",
    sp: "heartrate",
    hr: "heartrate",
    t: "temperature",
  };

 


  return (
    <main className="w-screen h-screen pt-10 px-4 flex flex-col gap-2 items-start bg-[#F6F6F6]  ">
      <Link href="/dashboard">
      <div className="flex justify-center items-center">
        
        <Image alt="initiate" src={left_arrow} className="w-6" />
        
        <h2 className="ml-4 text-lg capitalize font-semibold text-darkblue">
          {slugtourl[params.slug]}
        </h2>
      </div>
      </Link>
      <Button
        className="h-[7rem] w-52 flex flex-col gap-2 items-end bg-green1"
        onClick={() => {
          router.push("/dashboard/alltests/" + slugtourl[params.slug]);
        }}
      >
        <Image alt="initiate" src={initiate_test} className="w-10" />
        <div className="flex justify-between w-full">
          <span className="text-left">
            Initiate <br /> test{" "}
          </span>

          <Image alt="initiate" src={right_arrow} className="" />
        </div>
      </Button>
      <div className="w-full h-[24rem]  rounded-xl shadow-lg p-4 pr-8 shadow-gray-200 bg-[#FCFCFC]">
      <SensorChart sensorType={params.slug} />
      </div>
    </main>
  );
}
