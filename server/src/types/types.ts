import {z} from "zod";

export const SignupSchema = z.object({
    username : z.string(),
    password : z.string(),
    email : z.string().email()
});


export const SinginSchema = z.object({
    email: z.string(),
    password: z.string()
});

export type userSignupSchema = z.infer<typeof SignupSchema>
export type userSigninSchema = z.infer<typeof SinginSchema>