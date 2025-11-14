import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { Auth, DecodedIdToken, getAuth } from "firebase-admin/auth";

const defaultApp = initializeApp({
    credential: applicationDefault(),
});

const auth: Auth = getAuth(defaultApp);

declare module "fastify" {
    interface FastifyRequest {
        user?: DecodedIdToken;
    }
}

// Firebase auth middleware
export async function firebaseAuth(
    request: FastifyRequest,
    reply: FastifyReply,
    next: HookHandlerDoneFunction
): Promise<void> {
    const authHeader = request.headers.authorization || "";

    console.log("Authorization Header:", authHeader);
    if (!authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Unauthorized" });
    }
    const idToken = authHeader.split(" ")[1];
    try {
        const decoded = await auth.verifyIdToken(idToken!);
        request.user = decoded;
        next();
    } catch (err) {
        console.error("Firebase token verification failed:", err);
        return reply.status(401).send({ error: "Unauthorized" });
    }
}
