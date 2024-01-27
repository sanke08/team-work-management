import { any, z } from "zod"

export const LoginValidator = z.object({
    email: z.string(),
    password: z.string().min(8).max(15)
})

export type LoginRequest = z.infer<typeof LoginValidator>


export const RegisterValidator = z.object({
    email: z.string(),
    password: z.string().min(8).max(15),
    name:z.string().min(3).max(15)
})

export type RegisterRequest = z.infer<typeof RegisterValidator>