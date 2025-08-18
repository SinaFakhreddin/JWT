import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateToken } from "./middlewares/authMiddleware.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// اتصال به دیتابیس
connectDB().then(()=>console.log("Connected to DB."));

// Routes
app.use("/auth", authRoutes);

// Protected route
app.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
});

app.listen(5000, () => console.log("Server running on port 5000"));
