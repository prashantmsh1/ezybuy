import type { Product, Category } from "@repo/product-db";

export type ProductType = typeof Product;
export type CategoryType = typeof Category;
export type StripeProductType = {
	id: string;
	name: string;
	price: number;
};
 






