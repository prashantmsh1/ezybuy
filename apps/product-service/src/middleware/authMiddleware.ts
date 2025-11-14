import { Request, Response, NextFunction } from "express";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";

const defaultApp = initializeApp({
    credential: applicationDefault(),
});

const auth = getAuth(defaultApp);

// attach user type to Request
declare global {
    namespace Express {
        interface Request {
            user?: DecodedIdToken;
        }
    }
}

// Firebase auth middleware
export async function firebaseAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || "";

    console.log("Authorization Header:", authHeader);
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const idToken = authHeader.split(" ")[1];
    try {
        const decoded = await auth.verifyIdToken(idToken!);
        req.user = decoded;

        next();
    } catch (err) {
        console.error("Firebase token verification failed:", err);
        return res.status(401).json({ error: "Unauthorized" });
    }
}
