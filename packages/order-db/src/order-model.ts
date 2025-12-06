import { InferSchemaType, model, Schema } from "mongoose";

export const orderStatus = ["pending", "completed", "failed", "cancelled", "refunded"];
const orderSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: orderStatus,
        },
        product: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    quantity: {
                        type: String,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export type OrderSchema = InferSchemaType<typeof orderSchema>;
export const Order = model("order", orderSchema);
