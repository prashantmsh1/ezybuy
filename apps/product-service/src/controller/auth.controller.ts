import { DecodedIdToken } from "firebase-admin/auth";
import { Request, Response } from "express";
import { auth } from "../middleware/authMiddleware";

export const makeAdmin = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        const uid = user?.uid;
        const secretKey = req.header("x-admin-secret");

        if (secretKey !== process.env.ADMIN_SECRET) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            // This is the magic line
            await auth.setCustomUserClaims(uid!, { isAdmin: true });

            return res.json({ message: `User ${uid} is now an Admin.` });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to set claims" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


