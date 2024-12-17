import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";
import { verifyToken } from "../backend/middleware/authMiddleware.js";  // Auth middleware

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", verifyToken, userRoutes);  // Token validation middleware applied here for user routes
app.use("/api/posts", verifyToken, postRoutes);  // Token validation middleware for posts
app.use("/api/notifications", verifyToken, notificationRoutes);  // Token validation for notifications

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});