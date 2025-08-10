import dotenv from "dotenv";
dotenv.config({ path: "config.env" });

import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";

const port = process.env.PORT || 3000;

// Connect to the database and start the server
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`⚙️  Server is running at port: ${port}`);
        });

        app.on("error", (error) => {
            console.error("APP ERROR: ", error);
            throw error;
        });
    })
    .catch((err) => {
        console.error("MONGO DB connection failed !!! ", err);
        process.exit(1);
    });