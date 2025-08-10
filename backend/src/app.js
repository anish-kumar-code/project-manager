import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

// --- Routes import ---
import userRouter from './routes/user.routes.js'
import projectRouter from './routes/project.routes.js'

// --- Error handling middleware ---
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
const origin = process.env.CORS_ORIGIN;

// CORS settings
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

// Middleware to parse JSON
// Middleware to parse URL-encoded data
// Middleware to serve static files (e.g., images, PDFs)
// Middleware to handle cookies
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);


// Simple route for testing
app.get("/", (req, res) => {
    res.send("Project Manager API is running!");
});


// --- CUSTOM ERROR HANDLER MIDDLEWARE ---
app.use(errorHandler);

export { app };
