import { applicationDefault, initializeApp } from "firebase-admin/app";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { createMiddleware } from "hono/factory";
const defaultApp = initializeApp({
 credential: applicationDefault(),
});

const auth = getAuth(defaultApp);

import { AuthUser } from "@repo/types";
import "@repo/types/hono"

export const shouldBeUser = createMiddleware<{
 Variables: {
  user: AuthUser;
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
  const decoded = (await auth.verifyIdToken(idToken!)) as AuthUser;
  // attach decoded token to context state so handlers can read it
  c.set("user", decoded);
  await next();
 } catch (err) {
  console.error("Firebase token verification failed:", err);
  return c.json({ error: "Unauthorized" }, 401);
 }
});

export const shouldBeAdmin = createMiddleware<{
    Variables: {
        user: AuthUser;
    };
}>(async (c, next) => {
    const user = c.get("user");
    if (!user?.admin) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
});