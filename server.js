import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateToken } from "./middlewares/authMiddleware.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors"
import dotenv from "dotenv";
import {dropStaleIndex} from "./controllers/dbControllers.js";
import productsRoutes from "./routes/productsRoutes.js";


dotenv.config()
const app = express();
app.use(express.json());
app.use(cookieParser());

// اتصال به دیتابیس
connectDB().then(()=>console.log("Connected to DB."))

app.use(helmet());
app.use(cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());




//prevent brut-force attack
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/auth" , limiter)


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes)



// Protected route
app.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });

});

app.listen(5000, () => console.log("Fucking Server is running on port 5000"));
