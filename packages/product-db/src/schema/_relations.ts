import { relations } from "drizzle-orm";
import { Category, Product } from "./product";

export const productRelations = relations(Product, ({ one }) => ({
    // Define relations here in future

    category: one(Category, {
        fields: [Product.categorySlug],
        references: [Category.slug],
    }),
}));

export const categoryRelations = relations(Category, ({ many }) => ({
    products: many(Product),
}));
