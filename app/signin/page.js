"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';
import { Signin } from '@/Database/Auth'


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { userDataManager } from "@/Config/userManager";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  pin: z.string().min(4).max(4),
})

export default function Page () {

  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      pin: '',
    },
  })
  
  async function onSubmit(userdata) {
    Signin(userdata)
    userDataManager.set("username",userdata)
    userDataManager.set("upcoming_appointments","No Upcoming Appointments")
    // router.push('/dashboard');
  }
  

  return (
    <main className="w-screen h-screen">
      <div className="flex justify-center items-center h-full w-full">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex flex-col justify-center">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="User Name" {...field} />
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
                <Input placeholder="Pin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign In</Button>
      </form>
    </Form>
      </div>
    </main>
  )
}
