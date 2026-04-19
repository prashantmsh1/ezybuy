import { AuthUser } from "./auth.js";
import "fastify"
declare module "fastify" {
    interface FastifyRequest {
        user?: AuthUser;
    }
}
