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
import { firebaseAuth, shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/",firebaseAuth,shouldBeAdmin, createProduct);
router.put("/:id", firebaseAuth,shouldBeAdmin, updateProduct);

router.delete("/:id", firebaseAuth, shouldBeAdmin, deleteProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
