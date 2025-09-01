import express from "express";
import {refresh, logout, otpRequest, verifyOtp, resendOtp, checkOtpStatus} from "../controllers/authController.js";

const router = express.Router();



router.post("/otp-request" , otpRequest)
router.post("/verify-otp" , verifyOtp)
router.post("/resend-otp",resendOtp)
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/otp-status/:transactionId", checkOtpStatus);


export default router;
