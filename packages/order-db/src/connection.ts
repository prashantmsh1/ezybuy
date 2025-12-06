import mongoose from "mongoose";

export const connectToDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("Please provide MONGODB_URI in the environment variables");
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};
