"use client";

import { UserDataManager } from "@/Config/userManager";
import { useState, useEffect, useRef } from "react";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const [userdata, setuserdata] = useState({})
  const datamanager = useRef(new UserDataManager())

  useEffect(() => {
    setuserdata(datamanager.current.getAll())
    const handleStorageChange = () => {
      setuserdata(datamanager.current.getAll())
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);



  if (Object.keys(userdata).length !== 0)
    return (
      <>
       <Dashboard data={userdata} setuserdata={setuserdata} datamanager={datamanager} />
      </>
    );

    else
    return (
      <main className="h-screen w-screen flex flex-col p-4 ">
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
          <h1>Please sign In to continue</h1>
          <Button><Link href='/signin'>Sign In</Link></Button>
        </div>
      </main>
    );
}
