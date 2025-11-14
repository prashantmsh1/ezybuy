How to use @repo/product-db in other backend services
=====================================================

This package exports the database helper (lazy initialization) and schema definitions for other services to import and use.

Exports
- initializeDb(connectionString?): Promise<Database> — initialize the DB connection (reads `process.env.DATABASE_URL` by default).
- getDb(): Database — get the initialized database client (must call `initializeDb()` first or `getDb()` will throw).
- closeDbPool(): Promise<void> — close DB pool.
- schema (default export) — merged schema object.
- Schema and Database types are available as named type exports.
- Named table exports (Product, Category, User...) are re-exported and can be imported from the package root.

Recommended usage (example with Express)
----------------------------------------

```ts
import express from 'express';
import { initializeDb, getDb } from '@repo/product-db';
import { Product } from '@repo/product-db';

const app = express();

await initializeDb(); // throws if DATABASE_URL not set or connection cannot be established

app.get('/products', async (req, res) => {
  const db = getDb();
  const products = await db.select().from(Product);
  res.json(products);
});

// call closeDbPool() on shutdown
```

Notes
-----
- `initializeDb()` must be called once per process before calling `getDb()`.
- We deliberately do not initialize the DB at import time so that TypeScript-only tools and builds which import the package do not fail.
- If you'd like to use the schema only (no DB), import `import schema from '@repo/product-db'` or `import { Product } from '@repo/product-db'` to reference table definitions.
