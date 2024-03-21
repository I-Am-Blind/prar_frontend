"use client";
import { Toaster } from "@/components/ui/toaster";
import { UserDataManager } from "@/Config/userManager";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserDataContext from "@/Context/UserDataContext";
import { GetAllUsers } from "@/Database/Auth";
import ausa_logo from "@/public/assets/ausa_logo_2.png";
import Image from "next/image";
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

export default function Home() {
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
      <main className="h-screen w-screen flex  justify-center items-center p-4">
      <Image src={ausa_logo} alt="AUSA" className="w-[433px] h-[301px] -ml-32" />
      <div className="w-[1px] h-96 bg-gray-100 mr-12"></div>
        <div className="flex flex-col p-4">
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

          {users?.length !== 0 && (
            <h2 className="font-light text-sm text-gray-500">Or</h2>
          )}
          <Link href={`/signup`} passHref>
            <Button>Sign Up</Button>
          </Link>
        </div>
        </div>
      </main>
    </UserDataContext.Provider>
  );
}
