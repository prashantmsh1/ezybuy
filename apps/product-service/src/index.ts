import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3002", "http://localhost:3003"],
        credentials: true,
    })
);

app.get("/health", (req: Request, res: Response) => {
    return res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    });
});

app.get("/test", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Product service Authenticated " });
});
app.listen(3005, () => {
    console.log("Product service is running on port 3005");
});
