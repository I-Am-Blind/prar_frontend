import * as z from "zod";

export const formSchema = z.object({
    name: z.string().min(2).max(100),
    username: z.string().min(2).max(50),
    pin: z.string().min(4).max(4),
    age: z.string().min(1).max(3),
    sex: z.enum(["Male", "Female", "Other"]),
    height: z.string().min(1),
    weight: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    healthId: z.string().min(5),
    underlyingConditions: z.string().optional(),
    emergencyContact: z.string().min(10).max(10),
  })
  
  export const formFields = [
    { name: "name", placeholder: "Name", type: "text" },
    { name: "username", placeholder: "Username", type: "text" },
    { name: "pin", placeholder: "PIN", type: "password" },
    { name: "age", placeholder: "Age", type: "text" },
    {
      name: "sex",
      placeholder: "Sex",
      type: "select",
      options: ["Male", "Female", "Other"],
    },
    { name: "height", placeholder: "Height (cm) ", type: "text" },
    { name: "weight", placeholder: "Weight (Kg)", type: "text" },
    { name: "phone", placeholder: "Phone Number", type: "tel" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "healthId", placeholder: "Health ID", type: "text" },
    {
      name: "underlyingConditions",
      placeholder: "Underlying Conditions",
      type: "text",
    },
    { name: "emergencyContact", placeholder: "Emergency Contact", type: "tel" },
  ]

  export const defaultValues = {
    name: '',
    username: '',
    pin: '',
    age: '',  
    sex: '',  
    height: '',  
    weight: '',  
    phone: '',
    email: '',
    healthId: '',
    underlyingConditions: '',
    emergencyContact: ''
  }