import * as users from "./user";
import * as products from "./product";
import * as relations from "./_relations";

export type Schema = typeof schema;

const schema = {
    ...users,
    ...products,
    ...relations,
};
export default schema;

// Re-export named imports from the files so consumers can import tables directly
export * from "./product";
export * from "./user";
export * from "./_relations";
