import { z } from "zod";

export const createPetSchema = z.object({
  name: z
    .string()
    .min(1, "Pet name is required and cannot be empty.")
    .max(50, "Pet name must be 50 characters or less."),

  species: z.enum(["dog", "cat", "bird", "fish", "other"], {
    errorMap: () => ({ message: "Please select a valid pet type." }),
  }),

  age: z
    .string()
    .transform((val) => parseInt(val, 10)) // Convert string to integer
    .refine((val) => Number.isInteger(val), {
      message: "Age must be a valid integer.",
    })
    .refine((val) => val >= 0 && val <= 50, {
      message: "Age must be between 0 and 50 years.",
    }),

  breed: z
    .string()
    .min(1, "Pet breed is required and cannot be empty.")
    .max(50, "Pet breed must be 50 characters or less."),

  //   ownerId: z.string().uuid("Owner ID must be a valid UUID."),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
