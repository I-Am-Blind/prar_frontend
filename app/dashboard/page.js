"use client";
import moment from "moment-timezone";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardReadings from "@/components/DashboardReadings";
import { DashboardSettings } from "@/components/DashboardSettings";
import { useToast } from "@/components/ui/use-toast";
import UserDataContext from "@/Context/UserDataContext";
//Assets Import
import sensors_svg from "@/public/assets/dash_svg_1.svg";
import right_arrow_white_svg from "@/public/assets/right_arrow_white.svg";
import all_tests_svg from "@/public/assets/all_tests.svg";
import right_arrow_blue from "@/public/assets/right_arrow_blue.svg";
import right_arrow_blue_long from "@/public/assets/right_arrow_blue_long.svg";
import previous_scans from "@/public/assets/previous_scans.svg";
import Link from "next/link";
//Assets Import
import { ref, onValue, off } from "firebase/database";
import { db } from "@/Config/firebaseconfig";
import { GetLastReadings } from '@/Database/Sensors'

export default function Dashboard() {
  const { userdata, datamanager } = useContext(UserDataContext);
  const data = userdata;
  const [lastreadings, setlastreadings] = useState(['160/140',88,88,88,88])
  const [appointments, setappointments] = useState(
    data?.user?.upcoming_appointments
  );

  const { toast } = useToast();
  useEffect(() => {
    toast({
      title: "Sign In Successful",
      description: `${data?.user?.name} signed in `,
    });

    const userAppointmentsRef = ref(
      db,
      `user_appointments/${userdata?.user?.id}`
    );
     onValue(userAppointmentsRef, (snapshot) => {
      const appointmentsData = snapshot.val();
      userdata.upcoming_appointments = appointmentsData;
      setappointments(appointmentsData);
    });

    async function getlastreadings () {
      const readings = await GetLastReadings()
      setlastreadings([
        `${readings?.bp[0]?.readings}`,
        readings?.hr[0]?.readings,
        readings?.sp[0]?.readings,
        37,
        readings?.bg[0]?.readings,
      ])
    }
    getlastreadings() 
    return () => off(userAppointmentsRef);
  }, []);

  const [selectedgraph, setselectedgraph] = useState("Daily");
  const buttons = ["Daily", "Weekly", "Monthly"];

  const handleButtonClick = (value) => {
    setselectedgraph(value);
  };
  const handleLogout = () => {
    datamanager.deleteSession();
    updateUserData();
  };

  return (
    <main className="h-screen w-screen flex flex-col p-4 ">
      <section className="top-section w-full h-[20%]">
        <DashboardSettings handleLogout={handleLogout} />
      </section>
      <section className="middle-section w-full h-[40%] grid grid-cols-3 grid-rows-3 gap-4">
        <div className="row-span-3 col-span-2 card-1 flex gap-4">
          <div className="h-full w-[60%] flex flex-col items-start justify-center">
            <span className="w-full flex justify-between items-center">
              <div className="label-1 w-max">Your health score</div>
              <span className="flex gap-1 items-center justify-center">
                {buttons.map((buttonValue) => (
                  <Button
                    key={buttonValue}
                    className={`h-6 w-18 text-xs `}
                    variant={`${
                      selectedgraph === buttonValue ? "" : "secondary"
                    }`}
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
              <TabsList className="text-primtext">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="consult">Consult</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="p-2">
                <div className=" text-sm flex flex-col gap-1 items-center text-center h-full">
                  {appointments?.link ? (
                    <>
                      <span>
                        <span>Appointment with </span>
                        <span className="text-blue-700 font-bold">
                          {appointments?.doctorName}
                        </span>
                      </span>
                      <span>
                        at
                        <span className="text-blue-700 font-bold">
                          {" "}
                          {moment(
                            appointments?.timestamp,
                            "MMM DD, YYYY at hh:mm:ssA Z"
                          ).format("hh:mm A")}{" "}
                        </span>
                        on
                        <span className="text-blue-700 font-bold">
                          {" "}
                          {moment(
                            appointments?.timestamp,
                            "MMM DD, YYYY at hh:mm:ssA Z"
                          ).format("MMM DD, YYYY")}
                        </span>
                      </span>
                      <button className="bg-primary w-max text-white rounded-lg px-5 py-1 mt-4">
                        <a href={`${appointments?.link}`} target="_blank">
                          Join
                        </a>
                      </button>
                    </>
                  ) : (
                    <>No Upcoming Appointments</>
                  )}
                </div>
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
            <Image alt="Test" src={right_arrow_white_svg} />
          </span>
          <h3 className="text-sm font-light">
            Heart rate & SpO2, Blood pressure, Body temperature{" "}
          </h3>
        </button>
        <Link
          href="/dashboard/alltests"
          className="row-span-1 card-1 flex  justify-between"
        >
          <span className="flex gap-2 items-center">
            <Image alt="img" src={all_tests_svg} />
            <h2>Show All Tests</h2>
          </span>
          <Image alt="img" src={right_arrow_blue} />
        </Link>
      </section>
      <section className="bottom-section w-full h-[40%] flex justify-center items-center ">
        <div className="card-1 w-full h-[90%] grid grid-cols-8 grid-rows-4 p-0">
          <h3 className="col-span-7 h-4 label-1 mx-8">Your Last Readings</h3>
          <div className="vitals-container col-span-7 h-full">
            <DashboardReadings vitals={lastreadings} />
          </div>
          <button className="previous-scans justify-center items-center col-start-8 row-span-4 row-start-1 flex flex-col gap-4 border-primary border-[1px] h-full rounded-e-xl p-4 ">
          <Link
          href="/dashboard/previousScans">
            <span className="flex flex-col gap-4">
              <Image alt="img" src={previous_scans} />
              <h3 className="text-primary font-medium">
                Previous
                <br />
                Scans
              </h3>
            </span>
            <Image alt="img" src={right_arrow_blue_long} />
            </Link>
          </button>
          
        </div>
      </section>
    </main>
  );
}
