"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldBeUser = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const factory_1 = require("hono/factory");
const defaultApp = (0, app_1.initializeApp)({
    credential: (0, app_1.applicationDefault)(),
});
const auth = (0, auth_1.getAuth)(defaultApp);
exports.shouldBeUser = (0, factory_1.createMiddleware)(async (c, next) => {
    // request object
    const authHeader = c.req.header("authorization") || "";
    console.log("Authorization Header:", authHeader);
    if (!authHeader.startsWith("Bearer ")) {
        // use Hono response helpers
        return c.json({ error: "Unauthorized" }, 401);
    }
    const idToken = authHeader.split(" ")[1];
    try {
        const decoded = await auth.verifyIdToken(idToken);
        // attach decoded token to context state so handlers can read it
        c.set("user", decoded);
        await next();
    }
    catch (err) {
        console.error("Firebase token verification failed:", err);
        return c.json({ error: "Unauthorized" }, 401);
    }
});
