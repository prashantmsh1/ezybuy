/**
 * Generic Auth User based on Firebase DecodedIdToken
 * but extensible for other providers.
 */
export interface AuthUser {
    uid: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    role?: "user" | "admin";
    admin?: boolean;
    [key: string]: any;
}