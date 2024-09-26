import { z } from "zod";

// Email regex for basic validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters")
    .regex(emailRegex, "Invalid email format"),
  password: z.string().min(1, "Enter Password").max(255),
});

const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters")
    .regex(emailRegex, "Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(255, "Password must be less than 255 characters"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .max(255, "Phone number must be less than 255 characters"),
});
export default LoginSchema;
