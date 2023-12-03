"use client";

import { userDataManager } from "@/Config/userManager";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
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
              <div className="label-1 text-xs w-max">Your health score</div>
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
            <Tabs defaultValue="upcoming" className="w-full text-sm ">
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
        <div className="row-span-2 card-1 bg-primary text-background flex flex-col justify-between">
          <span className="flex justify-between w-full">
            <Image alt="svgs here "/>
            <Button className="">➔</Button>
          </span>
          <h3 className="text-sm font-ligh">Heart rate & SpO2, Blood pressure, Body temperature </h3>
        </div>
        <div className="row-span-1 card-1 flex  justify-around ">
          <Image alt="img" />
          <h2>Show All Tests</h2>
          <Image alt="img" />
        </div>
      </section>
      <section className="bottom-section w-full h-[40%] flex justify-center items-center">
        <div className="card-1 w-full h-[90%] grid grid-cols-8 grid-rows-4 py-0">
          <h3 className="col-span-7 row-span-1 label-1">Your Last Readings</h3>
          <div className="vitals-container col-span-7 row-span-3">vitals</div>
          <div className="previous-scans">
            <Image alt="img" />
            <h3>
              Previous
              <br />
              Scans
            </h3>
            <Button>
              <Image alt="img" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
