import express from "express";
import { Router } from "express";
import type { Request, Response } from "express";
import { user } from '../database/db.js';
import { SinginSchema, SignupSchema } from "../types/types.js"
const router = Router()

router.use(express.json())

router.get("/users", async function (req: Request, res: Response) {

    const users = await user.find({});
    res.status(200).json({
        users
    });
    console.log(users);

});

router.post("/signin", async function (req: Request, res: Response) {

    const credentials = req.body;
    const result = SinginSchema.safeParse(credentials);

    if (!result.success) {
        return res.status(400).json(
            {
                message: "Credentials type in incorrect",
                errors: result.error
            }
        )
    }

    const { email, password } = result.data;

    try {
        const person = await user.findOne({email,password});

        if(!person){
            return res.status(403).json({message: "Invalid Email or Password"})
        }

        res.status(200).json({ message: "login successfull" })
        console.log(person);
    } catch (e) {
        res.status(500).json({ message: "Error while login" })

    }

});

router.post("/signup", async function (req: Request, res: Response) {

    const inputBody = req.body;
    const result = SignupSchema.safeParse(inputBody);

    if (!result.success) {
        return res.status(400).json({ message: "body formate is incorrect" });
    }

    const { username, password, email } = result.data;

    try {
        const person = await user.create({
            username,
            password,
            email
        });
        res.status(200).json({ message: "user created successfully" })
        console.log(person)

    } catch (e) {
        res.status(400).json({
            message: "something went wrong"
        });
    }

});

router.get("/health", function (req: Request, res: Response) {
    res.status(200).json({ message: "user-router is responding" })
});

export default router;