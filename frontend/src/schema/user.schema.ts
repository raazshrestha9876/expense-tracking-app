import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email("Invalid email"),
  phoneNumber: z
    .string()
    .regex(/^\d{10,}$/, {
      message:
        "Phone number must contain only digits and be at least 10 digits",
    })
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  image: z.union([z.instanceof(File), z.string().optional()]).optional(),
  gender: z.enum(["male", "female"]).optional(),
  dob: z.date().optional(),
  occupation: z.string().optional(),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string(),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

