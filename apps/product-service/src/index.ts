import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { firebaseAuth } from "./middleware/authMiddleware.js";
import { initializeDb, getDb } from "@repo/product-db";
import { Product } from "@repo/product-db";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3002", "http://localhost:3003"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.get("/health", (req: Request, res: Response) => {
    return res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    });
});

// protected route example
app.get("/test", firebaseAuth, (req: Request, res: Response) => {
    return res.status(200).json({ message: "Product service Authenticated", uid: req.user?.uid });
});
app.get("/products", async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const products = await db.select().from(Product);
        return res.status(200).json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: "Failed to fetch products" });
    }
});
await initializeDb().catch((err: unknown) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
});

app.listen(3005, () => {
    console.log("Product service is running on port 3005");
});
