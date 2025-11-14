import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { initializeDb } from "@repo/product-db";
import { cors } from "hono/cors";

const app = new Hono();
app.use(
    "*",
    cors({
        origin: ["http://localhost:3002", "http://localhost:3003"], // or true
        credentials: true,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        maxAge: 86400,
    })
);

app.get("/health", (c) => {
    return c.json({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    });
});

app.get("/test", shouldBeUser, (c) => {
    return c.json({
        message: "Payment service is authenticated" + JSON.stringify(c.get("user") as unknown),
    });
});

const start = async () => {
    try {
        await initializeDb();
        serve(
            {
                fetch: app.fetch,
                port: 3010,
            },
            (info) => {
                console.log(`Payment service is running on ${info.address}:${info.port}`);
            }
        );
    } catch (error) {
        console.error("Error starting payment service:", error);
        process.exit(1);
    }
};

start();
