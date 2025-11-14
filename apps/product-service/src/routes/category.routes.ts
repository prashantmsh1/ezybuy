import { Router } from "express";

const router: Router = Router();

router.get("/test", async (req, res) => {
    // Placeholder response
    res.status(200).json([
        { id: 1, name: "Electronics" },
        { id: 2, name: "Books" },
        { id: 3, name: "Clothing" },
    ]);
});

export default router;
