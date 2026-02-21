import express, { Router } from 'express';
import "dotenv/config"
import type { Request, Response } from 'express';
import userRouter from "./user/user.js"


const app = express();
app.use(express.json())
const port = process.env.PORT || 3000;

app.get("/server/test", (req: Request, res: Response) => {
    res.status(200).json({
        message: "server health is good"
    });
});
app.listen(port, () => {
    console.log(`Server is rinning at http://localhost${port}`)
});

app.use("/user", userRouter);