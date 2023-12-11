"use client";
import { Manrope } from "next/font/google";
import "../../app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserDataManager } from "@/Config/userManager";
import React,{ useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserDataContext from '@/Context/UserDataContext'
const manrope = Manrope({ subsets: ["cyrillic"], weight: "variable" });

export default function RootLayout({ children }) {
  const [userdata, setuserdata] = useState({});
  const datamanager = new UserDataManager()
  const updateUserData = () => {
    setuserdata(datamanager.getAll());
  };
  useEffect(() => {  
    updateUserData();
  }, []);


  return (
    <UserDataContext.Provider value={{ userdata, updateUserData, datamanager }}>
      {Object.keys(userdata).length !== 0 ? (
        <div className={manrope.className}>
          {children}
          <Toaster />
        </div>
      ) : (
        <main className="h-screen w-screen flex flex-col p-4">
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <h1>Please sign In to continue</h1>
            <Link href="/signin" passHref><Button>Sign In</Button></Link>
          </div>
        </main>
      )}
    </UserDataContext.Provider>
  );
}
