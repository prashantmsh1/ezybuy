// Ensure the `pg` driver is installed alongside drizzle: `pnpm add pg`
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import schema from "./schema";

let pool: Pool | undefined;
let _db: ReturnType<typeof drizzle> | undefined;

export type Database = ReturnType<typeof drizzle>;

function getLogger() {
    return process.env.NODE_ENV !== "production";
}

export async function initializeDb(connectionString?: string) {
    const conn = connectionString ?? process.env.DATABASE_URL;
    if (!conn) {
        throw new Error("DATABASE_URL env var is required to initialize the database");
    }
    if (!_db) {
        pool = new Pool({
            connectionString: conn,
            ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
        });
        _db = drizzle(pool, {
            schema,
            logger: getLogger(),
        });
    }
    return _db;
}

export function getDb() {
    if (!_db) {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL env var is required to initialize the database");
        }
        // initialize synchronously is not possible (drizzle returns a value synchronously),
        // but to keep a simple API, we call initializeDb and throw if it returns undefined.
        throw new Error("Database not initialized. Call initializeDb() before getDb().");
    }
    return _db;
}

export async function closeDbPool() {
    if (!pool) return;
    await pool.end();
}
