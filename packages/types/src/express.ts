import { AuthUser } from "./auth.js";
import { Express } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
