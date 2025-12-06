import { FastifyInstance } from "fastify";
import { firebaseAuth } from "../middleware/authMiddleware";
import { Order } from "@repo/order-db";
export const orderRoutes = (app: FastifyInstance) => {
    app.post("/order", async (request, reply) => {
        reply.send("Order created");
    });

    app.get(
        "/user-orders",
        {
            preHandler: firebaseAuth,
        },
        async (request, reply) => {
            const orderData = await Order.find({ userId: request.user?.uid });
            reply.send({
                user: request.user,
                orders: orderData,
            });
        }
    );

    app.get("/orders", async (request, reply) => {
        const orderData = await Order.find();
        reply.send(orderData);
    });
};

export default orderRoutes;
