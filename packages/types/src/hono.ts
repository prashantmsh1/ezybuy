import { AuthUser } from "./auth.js";
import "hono"
declare module "hono" {
    interface ContextVariableMap {
        user: AuthUser;
    }
}
