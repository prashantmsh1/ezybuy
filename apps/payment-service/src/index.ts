import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => {
    return c.json({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    });
});

const start = async () => {
    try {
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
