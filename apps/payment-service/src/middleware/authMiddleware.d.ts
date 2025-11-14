import { DecodedIdToken } from "firebase-admin/auth";
export declare const shouldBeUser: import("hono").MiddlewareHandler<{
    Variables: {
        user: DecodedIdToken;
    };
}, string, {}, Response>;
//# sourceMappingURL=authMiddleware.d.ts.map