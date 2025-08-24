import express from "express";
import {refresh, logout, otpRequest, verifyOtp, resendOtp} from "../controllers/authController.js";

const router = express.Router();



router.post("/otp-request" , otpRequest)
router.post("/verify-otp" , verifyOtp)
router.post("/resend-otp",resendOtp)
router.post("/refresh", refresh);
router.post("/logout", logout);


export default router;
