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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";



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
    <main className="w-screen h-screen">
      <div className="flex justify-center items-center h-full w-full">
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
