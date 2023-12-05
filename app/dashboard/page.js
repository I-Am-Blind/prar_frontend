"use client";

import { userDataManager } from "@/Config/userManager";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';

//Assets Import
import sensors_svg from '@/public/assets/dash_svg_1.svg'
import right_arrow_white_svg from '@/public/assets/right_arrow_white.svg'
import all_tests_svg from '@/public/assets/all_tests.svg'
import right_arrow_blue from '@/public/assets/right_arrow_blue.svg'
import right_arrow_blue_long from '@/public/assets/right_arrow_blue_long.svg'
import previous_scans from '@/public/assets/previous_scans.svg'
import DashboardReadings from "@/components/DashboardReadings";
//Assets Import

export default function Page() {
  const router = useRouter()
  const [userdata, setuserdata] = useState()
  const [selectedgraph, setselectedgraph] = useState("Daily")
  const buttons = ['Daily', 'Weekly', 'Monthly'];
  
  const handleButtonClick = (value) => {
    setselectedgraph(value);
};
  useEffect(() => {
     setuserdata(userDataManager.get())
  }, []);

  return (
    <main className="h-screen w-screen flex flex-col p-4 ">
      <section className="top-section w-full h-[20%]"></section>
      <section className="middle-section w-full h-[40%] grid grid-cols-3 grid-rows-3 gap-4">
        <div className="row-span-3 col-span-2 card-1 flex gap-4">
          <div className="h-full w-[60%] flex flex-col items-start justify-center">
            <span className="w-full flex justify-between items-center  ">
              <div className="label-1  w-max">Your health score</div>
              <span className="flex gap-1 items-center justify-center">
              {buttons.map((buttonValue) => (
                <Button 
                    key={buttonValue}
                    className={`h-6 w-18 text-xs`}
                    variant = {`${selectedgraph === buttonValue ? '' : 'secondary'}`}
                    onClick={() => handleButtonClick(buttonValue)}
                >
                    {buttonValue}
                </Button>
            ))}
              </span>
            </span>
            <span className="w-full bg-slate-200 rounded-2xl p-2 mt-2 h-full">
              Graph Here
            </span>
          </div>
          <div className="h-full w-[40%]">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList  className="text-primtext">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="consult">Consult</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="p-2">
                <h2>{userdata?.upcoming_appointments}</h2>
              </TabsContent>
              <TabsContent value="consult">
                Do you want to consult a doctor?
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <button className="row-span-2 card-1 bg-primary text-background flex flex-col justify-between text-start shadow-blue-300 ">
          <span className="flex justify-between w-full">
            <Image alt="svgs here" src={sensors_svg} />
            <Image alt="Test" src={right_arrow_white_svg}/>
          </span>
          <h3 className="text-sm font-light">Heart rate & SpO2, Blood pressure, Body temperature </h3>
        </button>
        <button className="row-span-1 card-1 flex  justify-between">
          <span className="flex gap-2 items-center">
            <Image alt="img" src={all_tests_svg}/>
            <h2>Show All Tests</h2>
          </span>
          <Image alt="img" src={right_arrow_blue}/>
        </button>
      </section>
      <section className="bottom-section w-full h-[40%] flex justify-center items-center ">
        <div className="card-1 w-full h-[90%] grid grid-cols-8 grid-rows-4 p-0">
          <h3 className="col-span-7 h-4 label-1 mx-8">Your Last Readings</h3>
          <div className="vitals-container col-span-7 h-full">
            <DashboardReadings vitals={['160/140',96,98,37,86]}/>
          </div>
          <button className="previous-scans justify-center items-center col-start-8 row-span-4 row-start-1 flex flex-col gap-4 border-primary border-[1px] h-full rounded-e-xl p-4 ">
            <span className="flex flex-col gap-4">
            <Image alt="img" src={previous_scans} />
            <h3 className="text-primary font-medium">
              Previous
              <br />
              Scans
            </h3>
            </span>
            <Image alt="img" src={right_arrow_blue_long}/>
          </button>
        </div>
      </section>
    </main>
  );
}
