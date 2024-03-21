"use client";
import { Manrope } from "next/font/google";
import "../../app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserDataManager } from "@/Config/userManager";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserDataContext from "@/Context/UserDataContext";
import { GetAllUsers } from "@/Database/Auth";

const manrope = Manrope({ subsets: ["cyrillic"], weight: "variable" });

export default function RootLayout({ children }) {
  const [userdata, setuserdata] = useState({});
  const [users, setusers] = useState();
  const datamanager = new UserDataManager();
  const updateUserData = async () => {
    setuserdata(datamanager.getAll());
    setusers(await GetAllUsers());
  };
  useEffect(() => {
    updateUserData();
  }, []);

  return (
    <UserDataContext.Provider value={{ userdata, updateUserData, datamanager }}>
      {Object.keys(userdata).length !== 0 ? (
        <div className={`${manrope.className} bg-lightblue `}>
          {children}
          <Toaster />
        </div>
      ) : (
        <main className="h-screen w-screen flex flex-col p-4">
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            {users?.length !== 0 && <h2>Sign in as an existing user:</h2>}
            <div className="flex gap-4">
              {users?.map((user) => {
                return (
                  <Link
                    key={user.username}
                    href={`/signin?user=${user.username}`}
                    passHref
                  >
                    <div className="h-max flex flex-col  gap-2 border-blue-700 border-[2px] rounded-xl p-4 bg-blue-20 font-bold items-center justify-center">
                      <span>{user?.name}</span>
                      <span className="text-xs font-normal">
                        Username : {user?.username}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <h2 className="font-light text-sm text-gray-500">Or</h2>
            <Link href={`/signup`} passHref>
              <Button>Sign Up</Button>
            </Link>
          </div>
        </main>
      )}
    </UserDataContext.Provider>
  );
}
