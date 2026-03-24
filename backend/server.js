import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import seshRoutes from "./routes/seshRoutes.js";
import connectDB from "./utils/conn.js";
import path from "path";
import cors from "cors";
import passport from "passport";
import { configurePassport } from "./config/passport.js";
import authGoogleRoutes from "./routes/authGoogle.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

configurePassport();
app.use(passport.initialize());

// API Routes
app.use("/auth", authGoogleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/seshes", seshRoutes);

const __dirname = path.resolve("..");

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "dist");

  app.use(express.static(frontendPath));

  app.get(/^(?!\/api|\/auth).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
