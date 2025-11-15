import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { firebaseAuth } from "./middleware/authMiddleware.js";
import { initializeDb, getDb, Product } from "@repo/product-db";
import productRouter from "@/src/routes/product.routes.js";

import categoryRouter from "@/src/routes/category.routes.js";
const app = express();

app.use(express.json());
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
        return res.status(200).json({
            products: products,
            message: "Products fetched successfully",
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.use("/product", productRouter);
app.use("/category", categoryRouter);

await initializeDb().catch((err: unknown) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
});

app.listen(3005, () => {
    console.log("Product service is running on port 3005");
});
