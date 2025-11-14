import fastifyCors from "@fastify/cors";
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { firebaseAuth } from "./middleware/authMiddleware";
import { initializeDb, getDb } from "@repo/product-db";
import { userTable } from "@repo/product-db";

const fastify: FastifyInstance = Fastify();

fastify.register(fastifyCors, {
    origin: ["http://localhost:3002", "http://localhost:3003"], // or true for all origins
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    });
});

fastify.get(
    "/test",
    { preHandler: firebaseAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
        return reply
            .status(200)
            .send({ message: "Order Service Authenticated", uid: request.user?.uid });
    }
);

fastify.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const db = getDb();
        const users = await db.select().from(userTable);
        return reply.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        return reply.status(500).send({ error: "Failed to fetch users" });
    }
});

const start = async (): Promise<void> => {
    try {
        await initializeDb();
        await fastify.listen({ port: 8001 });
        console.log("Order Service is running at http://0.0.0.0:8001");
    } catch (err) {
        fastify.log.error(err as unknown);
        process.exit(1);
    }
};

start();
