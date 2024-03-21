"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Signup } from "@/Database/Auth";
import  SignUpToFirebase  from '@/Routes/SignUpToFirebase'
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {formSchema , formFields , defaultValues } from '@/components/Form/formControl'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import left_arrow from "@/public/assets/left_small_arrow_black.svg";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";



export default function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

 async function writeToLocalDb(userdata,generated_uidid) {
  userdata.id = generated_uidid
    const response = await Signup(userdata);
    if (response.error) {
      toast({
        description: response.message,
        variant: "destructive",
      });
    } else {
      toast({
        description: response.message,
      });
      router.push("/signin");
    }
  }

  async function onSubmit(userdata) {
    let res
       res = await SignUpToFirebase(process.env.NEXT_PUBLIC_DEVICE_ID,userdata)
       if ( !res.error ) {
        await writeToLocalDb(userdata,res?.id)
        toast({
          description: res.message,
        })
       } else {
       toast({
        description: res.message,
        variant: "destructive",
      })
    }
    
    
  }

  return (
    <main className="w-screen h-screen relative">
      <Link href="/">    
        <Image alt="initiate" src={left_arrow} className="w-6 absolute top-12 left-6" />
      </Link>
      <h2 className="absolute top-28 left-8 font-bold  text-xl">Enter your details to continue</h2>
      <div className="flex justify-center items-center h-full w-full pt-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-3 grid-rows-4 gap-4 w-full p-8"
          >
            {formFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormControl>
                    <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          {...formField}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Sign Up</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
