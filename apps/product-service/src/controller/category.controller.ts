import { Request, Response } from "express";
import { getDb, Category } from "@repo/product-db";

export const createCategory = async (req: Request, res: Response) => {
    const data = req.body;
    const category = await getDb().insert(Category).values(data).returning();

    res.status(201).json({ category: category, message: "Category created successfully" });
};
export const updateCategory = async (req: Request, res: Response) => {};

export const deleteCategory = async (req: Request, res: Response) => {};

export const getCategories = async (req: Request, res: Response) => {
    const categories = await getDb().select().from(Category);
    res.status(200).json({ categories });
};
export const getCategory = async (req: Request, res: Response) => {};
