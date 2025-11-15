import { Request, Response } from "express";
import { Product } from "@repo/product-db";
export const createProduct = async (req: Request, res: Response) => {
    const data: typeof Product = req.body;
};
export const updateProduct = async (req: Request, res: Response) => {};
export const deleteProduct = async (req: Request, res: Response) => {};
export const getProducts = async (req: Request, res: Response) => {};
export const getProduct = async (req: Request, res: Response) => {};
