import mongoose from "mongoose";

// Database name for the project
const DB_NAME = "projectmanager";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(
            `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error);
        process.exit(1);
    }
};

export default connectDB;