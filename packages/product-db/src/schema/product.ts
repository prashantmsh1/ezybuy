import { integer, json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const Product = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    shortDescription: text("short_description").notNull(),
    price: integer("price").notNull(),
    sizes: text("sizes").notNull(),
    colors: text("colors").notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    images: json("images").notNull(),
    categoryId: integer("category_id").notNull(),
    categorySlug: varchar("category_slug", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const Category = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
