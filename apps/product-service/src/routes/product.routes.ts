import { Router } from "express";
import { getDb } from "@repo/product-db";
import { Product } from "@repo/product-db";

const router: Router = Router();

router.get("/", async (req, res) => {
    try {
        const db = getDb();
        const products = await db.select().from(Product);
        return res.status(200).json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: "Failed to fetch products" });
    }
});

export default router;
