"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Signin } from "@/Database/Auth";
import { useToast } from "@/components/ui/use-toast";
import ausa_logo from "@/public/assets/ausa_logo_2.png";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserDataManager } from "@/Config/userManager";
import Image from "next/image";
import Link from "next/link";
import left_arrow from "@/public/assets/left_small_arrow_black.svg";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useRef, useState } from "react";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  pin: z.string().min(4).max(4),
});

export default function Page() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  const router = useRouter();
  const userDataManager = new UserDataManager();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user || "",
      pin: "",
    },
  });

  async function onSubmit(userdata) {
    const response = await Signin(userdata);
    if (response.error) {
      toast({
        description: response.message,
        variant: "destructive",
      });
    } else {
      userDataManager.set("user", {
        id: response?.userId,
        username: response?.username,
        name: response?.name,
        upcoming_appointments: response?.upcoming_appointments,
      });
      router.push("/dashboard");
    }
  }

  //keyboard stuff
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const activeInput = useRef("");
  const ignoreBlur = useRef(true);

  const onKeyPress = (button) => {
    ignoreBlur.current = false;
    if (button === "{enter}") {
      form.handleSubmit(onSubmit)(); 
      return; 
    }
    if (button === "{bksp}") {
      const currentValue = form.getValues(activeInput.current);
      const updatedValue = currentValue.slice(0, -1);
      form.setValue(activeInput.current, updatedValue, {
        shouldValidate: true,
      });
    } else {
      const currentValue = form.getValues(activeInput.current);
      const updatedValue = currentValue + button;
      form.setValue(activeInput.current, updatedValue, {
        shouldValidate: true,
      });
    }
    setTimeout(() => {
      ignoreBlur.current = true;
    }, 100);
  };

  const handleBlur =() => {
    ignoreBlur.current && setKeyboardVisible(false);
  }
  //

  return (
    <main className="w-screen h-screen">
      <Link href="/">
        <Image
          alt="initiate"
          src={left_arrow}
          className="w-6 absolute top-12 left-6"
        />
      </Link>
      <div className="flex  justify-center items-center h-full w-full gap">
        <Image
          src={ausa_logo}
          alt="AUSA"
          className="w-[433px] h-[301px] -ml-32"
        />
        <div className="w-[1px] h-96 bg-gray-100 mr-12"></div>
        <div className="flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-xl">Sign In</h2>
            <h2 className="text-gray-400 font-light text-sm">
              Please Enter your credentials to continue
            </h2>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-64 flex flex-col justify-center"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="User Name"
                        {...field}
                        onFocus={() => {
                          activeInput.current = "username";
                          setKeyboardVisible(true);
                        }}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Pin"
                        {...field}
                        type="password"
                        onFocus={() => {
                          activeInput.current = "pin";
                          setKeyboardVisible(true);
                        }}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Sign In</Button>
            </form>
          </Form>
        </div>
      </div>
      {keyboardVisible && (
        <div className="absolute bottom-0 w-full  py-4 px-4  glass justify-center  glass-effect border-[1px] border-gray-200 rounded-xl flex flex-col gap-2 items-center ">
          <span className="border-[1px] border-gray-400 rounded-lg px-4 py-1">{form.getValues(activeInput.current) ? form.getValues(activeInput.current) : "Your Input here" }</span>
          <div className="flex gap-4 w-full">
          <Keyboard onKeyPress={onKeyPress} />
          <Button className="" onClick={() => setKeyboardVisible(false)}>
            X
          </Button>
          </div>
        </div>
      )}
    </main>
  );
}
