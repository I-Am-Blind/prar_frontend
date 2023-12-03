"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';


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
  firstname: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
})

export default function Page () {

  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
    },
  })
  
  function onSubmit(values) {
    userDataManager.set("username",values)
    userDataManager.set("upcoming_appointments","No Upcoming Appointments")
    router.push('/dashboard');
  }
  

  return (
    <main className="w-screen h-screen">
      <div className="flex justify-center items-center h-full w-full">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex flex-col justify-center">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Log In</Button>
      </form>
    </Form>
      </div>
    </main>
  )
}
