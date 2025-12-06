import { Router } from "express";
import { getDb } from "@repo/product-db";
import { Product } from "@repo/product-db";
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
} from "../controller/product.controller";

const router: Router = Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
