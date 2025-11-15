"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const authMiddleware_1 = require("./middleware/authMiddleware");
const product_db_1 = require("@repo/product-db");
const cors_1 = require("hono/cors");
const app = new hono_1.Hono();
app.use("*", (0, cors_1.cors)({
    origin: ["http://localhost:3002", "http://localhost:3003"], // or true
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 86400,
}));
app.get("/health", (c) => {
    return c.json({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    });
});
app.get("/test", authMiddleware_1.shouldBeUser, (c) => {
    return c.json({
        message: "Payment service is authenticated" + JSON.stringify(c.get("user")),
    });
});
const start = async () => {
    try {
        await (0, product_db_1.initializeDb)();
        (0, node_server_1.serve)({
            fetch: app.fetch,
            port: 3010,
        }, (info) => {
            console.log(`Payment service is running on ${info.address}:${info.port}`);
        });
    }
    catch (error) {
        console.error("Error starting payment service:", error);
        process.exit(1);
    }
};
start();
