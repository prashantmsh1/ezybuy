import { applicationDefault, initializeApp } from "firebase-admin/app";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { createMiddleware } from "hono/factory";
const defaultApp = initializeApp({
    credential: applicationDefault(),
});

const auth = getAuth(defaultApp);

export const shouldBeUser = createMiddleware<{
    Variables: {
        user: DecodedIdToken;
    };
}>(async (c, next) => {
    // request object
    const authHeader = c.req.header("authorization") || "";

    console.log("Authorization Header:", authHeader);
    if (!authHeader.startsWith("Bearer ")) {
        // use Hono response helpers
        return c.json({ error: "Unauthorized" }, 401);
    }

    const idToken = authHeader.split(" ")[1];
    try {
        const decoded = await auth.verifyIdToken(idToken!);
        // attach decoded token to context state so handlers can read it
        c.set("user", decoded);
        await next();
    } catch (err) {
        console.error("Firebase token verification failed:", err);
        return c.json({ error: "Unauthorized" }, 401);
    }
});
