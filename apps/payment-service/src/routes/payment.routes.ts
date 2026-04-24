import { Hono } from "hono";
import { createPaymentIntent, createStripProduct, getStripeProductById } from "src/controller/payment.controller";
import { shouldBeUser } from "src/middleware/authMiddleware";

const router = new Hono();


router.get("/pay", shouldBeUser,createPaymentIntent)
router.post("/create-product",shouldBeUser,createStripProduct)
router.get("/get-product/:id",shouldBeUser,getStripeProductById)

export default router