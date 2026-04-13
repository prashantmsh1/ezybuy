import { Router } from "express";
import { makeAdmin } from "../controller/auth.controller";
import { firebaseAuth } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/make-admin", firebaseAuth , makeAdmin);

export default router;
