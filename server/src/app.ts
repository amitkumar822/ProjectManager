import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.trim(),
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// import all routes from here
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

// define routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/task", taskRoutes);

// Error Handler
app.use(errorHandler);

export default app;
