import express from "express";
import {refresh, logout, otpRequest, verifyOtp, resendOtp, checkOtpStatus} from "../controllers/authController.js";
import {createProducts, getAllProducts, getSingleProduct} from "../controllers/productsController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();



router.get("/", getAllProducts);
router.post("/", upload.single("image") ,createProducts);
router.get("/:productId", getSingleProduct);


export default router;
