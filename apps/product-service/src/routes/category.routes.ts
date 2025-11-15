import { Router } from "express";
import {
    createCategory,
    updateCategory,
    getCategories,
    getCategory,
    deleteCategory,
} from "../controller/category.controller";

const router: Router = Router();

router.get("/test", async (req, res) => {
    // Placeholder response
    res.status(200).json([
        { id: 1, name: "Electronics" },
        { id: 2, name: "Books" },
        { id: 3, name: "Clothing" },
    ]);
});

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
export default router;
