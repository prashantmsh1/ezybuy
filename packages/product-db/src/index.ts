import schema from "./schema";

export { schema };
export type { Schema } from "./schema";

export { initializeDb, getDb, closeDbPool } from "./database";
export type { Database } from "./database";

export default schema;

// Re-export schema named exports from package root so consumers can import tables via root.
export * from "./schema";
