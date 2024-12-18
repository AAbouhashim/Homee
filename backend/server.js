import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";
import { verifyToken } from "../backend/middleware/authMiddleware.js";  // Auth middleware

dotenv.config();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", verifyToken, userRoutes);  // Token validation middleware applied here for user routes
app.use("/api/posts", verifyToken, postRoutes);  // Token validation middleware for posts
app.use("/api/notifications", verifyToken, notificationRoutes);  // Token validation for notifications

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  }
  );
}
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});