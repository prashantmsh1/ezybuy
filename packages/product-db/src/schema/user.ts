import { pgTable, serial, text, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
});
