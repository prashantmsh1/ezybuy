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

        // If categoryId not provided, resolve it from categorySlug
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
export const updateProduct = async (req: Request, res: Response) => {};
export const deleteProduct = async (req: Request, res: Response) => {};
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
export const getProduct = async (req: Request, res: Response) => {};
