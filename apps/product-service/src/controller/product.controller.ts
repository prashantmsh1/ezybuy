import { Request, Response } from "express";
import {
    Category,
    getDb,
    Product,
    eq,
    InferInsertModel,
    asc,
    desc,
    sql,
    and,
} from "@repo/product-db";

type ProductInsertModel = InferInsertModel<typeof Product>;

export const createProduct = async (req: Request, res: Response) => {
    const data: ProductInsertModel = req.body;
    const db = getDb();
    try {
        // Basic validation
        if (!data.name || !data.price || (!data.categoryId && !data.categorySlug)) {
            return res.status(400).json({
                error: "Missing required fields: name, price, and categoryId or categorySlug",
            });
        }

        // Prepare data
        const prepared: any = { ...data };
        const { colors, images } = data;

        if (!colors || (Array.isArray(colors) && colors.length === 0)) {
            return res.status(400).json({ error: "At least one color is required" });
        }
        if (!images || typeof images !== "object") {
            return res.status(400).json({ error: "At least one image is required" });
        }
        let parsedColors: any[] | null = null;
        if (typeof colors === "string") {
            try {
                parsedColors = JSON.parse(colors); // could be stringified JSON array
            } catch {
                parsedColors = null; // invalid JSON -> will be caught by validation below
            }
        } else if (Array.isArray(colors)) {
            parsedColors = colors;
        }

        // Validate presence
        if (!parsedColors || parsedColors.length === 0) {
            return res.status(400).json({ error: "At least one color is required" });
        }

        const missingColors = parsedColors.filter((c) => !(c in images));
        if (missingColors.length > 0) {
            return res.status(400).json({
                error: `Images missing for colors: ${missingColors.join(", ")}`,
            });
        }

        // sizes/colors are text in schema -> stringify if arrays are provided
        if (Array.isArray(prepared.sizes)) prepared.sizes = JSON.stringify(prepared.sizes);
        if (Array.isArray(prepared.colors)) prepared.colors = JSON.stringify(prepared.colors);

        // images is JSON -> parse stringified JSON or keep as-is if array/object
        if (typeof prepared.images === "string") {
            try {
                prepared.images = JSON.parse(prepared.images);
            } catch {
                // if parsing fails, leave it as-is (the DB will reject if not valid JSON)
            }
        }

        if (!prepared.categoryId) {
            if (!prepared.categorySlug) {
                return res
                    .status(400)
                    .json({ error: "categorySlug required when categoryId is not provided" });
            }
            const categories = await db
                .select()
                .from(Category)
                .where(eq(Category.slug, prepared.categorySlug));
            const category = categories[0];
            if (!category) {
                return res
                    .status(400)
                    .json({ error: `Category with slug "${prepared.categorySlug}" not found` });
            }
            prepared.categoryId = category.id;
        }

        const [product] = await db.insert(Product).values(prepared).returning();
        res.status(201).json({ product, message: "Product created successfully" });
    } catch (err: any) {
        console.error("Failed to create product:", err);
        res.status(500).json({ error: err.message || "Failed to create product" });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const incoming = req.body;
    const data = incoming && typeof incoming === "object" ? (incoming.data ?? incoming) : null;

    if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Missing or invalid update payload" });
    }

    // Normalize fields similar to createProduct
    if (Array.isArray(data.sizes)) data.sizes = JSON.stringify(data.sizes);
    if (Array.isArray(data.colors)) data.colors = JSON.stringify(data.colors);
    if (typeof data.images === "string") {
        try {
            data.images = JSON.parse(data.images);
        } catch {
            // leave as-is so DB can validate if needed
        }
    }

    // If categorySlug provided but no categoryId, resolve it
    if (!data.categoryId && data.categorySlug) {
        const categories = await getDb()
            .select()
            .from(Category)
            .where(eq(Category.slug, String(data.categorySlug)));
        const category = categories[0];
        if (!category) {
            return res
                .status(400)
                .json({ error: `Category with slug "${data.categorySlug}" not found` });
        }
        data.categoryId = category.id;
    }

    // Remove undefined and disallowed fields to avoid passing them to .set()
    const forbiddenKeys = new Set(["id", "createdAt", "updatedAt", "created_at", "updated_at"]);

    const sanitizedEntries = Object.entries(data)
        .filter(([k, v]) => v !== undefined && typeof v !== "function" && !forbiddenKeys.has(k))
        .map(([k, v]) => {
            // Convert ISO-like date strings or numeric timestamps to Date objects
            if (typeof v === "string" && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
                const d = new Date(v);
                if (!isNaN(d.getTime())) return [k, d];
            }
            if (typeof v === "number" && (k.toLowerCase().includes("date") || k.endsWith("At"))) {
                const d = new Date(v);
                if (!isNaN(d.getTime())) return [k, d];
            }
            return [k, v];
        });

    const updateData: Record<string, any> = Object.fromEntries(sanitizedEntries);

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No updatable fields provided" });
    }

    try {
        const product = await getDb()
            .update(Product)
            .set(updateData)
            .where(eq(Product.id, Number(id)))
            .returning()
            .then((rows) => rows[0]);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ product, message: "Product updated successfully" });
    } catch (err: any) {
        console.error("Failed to update product:", err);
        res.status(500).json({ error: err.message || "Failed to update product" });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedCount = await getDb()
        .delete(Product)
        .where(eq(Product.id, Number(id)))
        .execute()
        .then((result) => result.rowCount || 0);
    if (deletedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
};
export const getProducts = async (req: Request, res: Response) => {
    const { sort, category, search, limit } = req.query;

    const orderBy = (() => {
        switch (sort) {
            case "asc":
                return asc(Product.price);
            case "desc":
                return desc(Product.price);
            case "oldest":
                return asc(Product.createdAt);
            default:
                return desc(Product.id);
        }
    })();

    const whereClauses: any[] = [];
    if (category) {
        // Filter by category slug on product (or use category join if needed)
        whereClauses.push(eq(Product.categorySlug, String(category)));
    }
    if (search) {
        const s = String(search).toLowerCase();
        whereClauses.push(sql`LOWER(${Product.name}) LIKE ${`%${s}%`}`);
    }

    let query = getDb()
        .select({
            product: Product,
            categoryName: Category.name,
            categorySlug: Category.slug,
        })
        .from(Product)
        .leftJoin(Category, eq(Product.categoryId, Category.id))
        .where(and(...whereClauses))
        .orderBy(orderBy)
        .limit(Number(limit) || 20);

    const products = await query;
    res.status(200).json({ products });
};
export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await getDb()
        .select()
        .from(Product)
        .where(eq(Product.id, Number(id)))
        .limit(1)
        .then((rows) => rows[0]);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product });
};
