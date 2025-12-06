import { Request, Response } from "express";
import { getDb, Category, InferInsertModel, eq } from "@repo/product-db";

type CategoryInsertModel = InferInsertModel<typeof Category>;
export const createCategory = async (req: Request, res: Response) => {
    const data = req.body;
    const category = await getDb().insert(Category).values(data).returning();

    res.status(201).json({ category: category, message: "Category created successfully" });
};
export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    const data: Partial<CategoryInsertModel> = req.body;
    const db = getDb();
    try {
        const existingCategories = await db
            .select()
            .from(Category)
            .where(eq(Category.id, Number(id)));
        const existingCategory = existingCategories[0];
        if (!existingCategory) {
            return res.status(404).json({ error: `Category with id "${id}" not found` });
        }

        const updatedCategory = { ...existingCategory, ...data };
        await db
            .update(Category)
            .set(updatedCategory)
            .where(eq(Category.id, Number(id)));

        res.status(200).json({
            category: updatedCategory,
            message: "Category updated successfully",
        });
    } catch (err: any) {
        console.error("Failed to update category:", err);
        res.status(500).json({ error: err.message || "Failed to update category" });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {};

export const getCategories = async (req: Request, res: Response) => {
    const categories = await getDb().select().from(Category);
    res.status(200).json({ categories });
};
export const getCategory = async (req: Request, res: Response) => {};
