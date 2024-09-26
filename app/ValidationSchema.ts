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

export default LoginSchema;
