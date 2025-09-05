import User from "../models/User.js";
import Token from "../models/Token.js";
import {generateAccessToken, generateRefreshToken,} from "../utils/token.js";
import jwt from "jsonwebtoken";
import {sendOTPSMS} from "../services/smsServices.js";
import bcrypt from "bcrypt";
import Otp from "../models/Otp.js";
import OTPSchema from "../models/Otp.js";
import mongoose from "mongoose";


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};






/// Main Functionality for validation temporary Commented


// export const otpRequest = async (req, res) => {
//
//     try {
//
//         const { phoneNumber } = req.body;
//         if (!phoneNumber) return res.status(400).json({ message: "Phone is required" });
//         let user = await User.findOne({ phoneNumber });
//         if (!user) {
//             user = new User({ phoneNumber });
//         }
//
//         const otp = generateOTP();
//         const hashedOtp = await bcrypt.hash(otp, 10);
//         const savedOtpDb = await OTPSchema.create({phone:phoneNumber , otp: hashedOtp})
//          // 🔒 hash OTP
//         user.otp = hashedOtp
//         user.otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
//         await user.save();
//         const otpSent = await sendOTPSMS(phoneNumber, otp);
//         const timeLeft = Math.floor((user.otpExpires - new Date()) / 1000);
//
//         if (!otpSent) {
//             await User.deleteOne({ otpSent });
//             return res.status(500).json({ error: 'Failed to send OTP email' });
//         } else {
//             res.status(201).json({
//                 message: 'OTP sent to phone number. Please verify to complete registration.',
//                 phoneNumber,
//                 expiredAt:timeLeft,
//                 transActionId:savedOtpDb._id.toString()
//             });
//         }
//     } catch (error) {
//         console.error('Signup error:', error);
//         res.status(500).json({ error: 'Server error during signup' });
//     }
// };
//
// export const verifyOtp = async (req, res) => {
//     const { phoneNumber, otp } = req.body;
//
//     const user = await User.findOne({ phoneNumber });
//     if (!user) return res.status(404).json({ message: "User not found" });
//
//     if (user.otp !== otp || Date.now() > user.otpExpires) {
//         return res.status(400).json({ message: "Invalid or expired OTP"});
//     }
//
//     user.otp = null;
//     user.otpExpiry = null;
//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);
//     user.refreshTokens.push(refreshToken);
//     user.isVerified=true
//     await user.save();
//     console.log("Token",accessToken , refreshToken)
//     // // ذخیره refreshToken در DB
//     await new Token({ userId: user._id, token: refreshToken.token }).save();
//     res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
//     res.status(200).json({accessToken });
//
// };
//
// export const refresh = async (req, res) => {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) return res.sendStatus(403);
//
//     const stored = await Token.findOne({ token: refreshToken });
//     if (!stored) return res.sendStatus(403);
//
//     jwt.verify(refreshToken, process.env["REFRESH_SECRET"], (err, user) => {
//         if (err) return res.sendStatus(403);
//
//         const newAccessToken = generateAccessToken({ _id: user.id, username: user.username });
//         res.json({ accessToken: newAccessToken });
//     });
// };


/// Main Functionality for validation temporary Commented









////Fake functionality for login

// ✅ otpRequest (همیشه OTP "1234" برمی‌گردونه)
export const otpRequest = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone is required" });
        }

        // فیک: کاربر رو پیدا کن یا بساز
        let user = await User.findOne({ phoneNumber });
        if (!user) {
            user = new User({ phoneNumber });
            await user.save();
        }

        // فیک: همیشه OTP = 1234
        const fakeOtp = 123456;

        res.status(201).json({
            message: "Fake OTP sent",
            phoneNumber,
            otp: fakeOtp, // ❌ برای تست، OTP رو همین‌جا می‌دی (بعداً حذف میشه)
            expiredAt: 120, // 2 دقیقه
        });
    } catch (error) {
        console.error("OTP Request error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ verifyOtp (فقط چک می‌کنه otp = "1234")
export const verifyOtp = async (req, res) => {

    console.log("FUCKING DISASTER")

    try {
        const { phoneNumber, otp } = req.body;

        console.log("otp received:", otp, "type:", typeof otp);

        // فیک: فقط بررسی کن OTP برابر "123456" باشه
        if (Number(otp) !== 123456) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // کاربر رو پیدا کن یا بساز
        let user = await User.findOne({ phoneNumber });
        if (!user) {
            user = new User({ phoneNumber });
            await user.save();
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        console.log("refreshToken generated:", refreshToken);

        // اگه refreshToken object باشه باید درست ذخیره بشه
        await new Token({
            userId: user._id,
            token: refreshToken.token || refreshToken
        }).save();

        res.cookie("refreshToken", refreshToken.token || refreshToken, {
            httpOnly: true,
            secure: true
        });

        res.status(200).json({
            accessToken,
            user_id: user._id,
            phoneNumber: user.phoneNumber
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// ✅ refresh همونطور که نوشتی می‌مونه
export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(403);

    const stored = await Token.findOne({ token: refreshToken });
    if (!stored) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env["REFRESH_SECRET"], (err, user) => {
        if (err) return res.sendStatus(403);

        const newAccessToken = generateAccessToken({
            _id: user.id,
            username: user.username,
        });
        res.json({ accessToken: newAccessToken });
    });
};


////Fake functionality for login









export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    await Token.findOneAndDelete({ token: refreshToken });
    res.clearCookie("refreshToken");
    res.sendStatus(204);
};




// 3. Check OTP status (for refresh)
export const checkOtpStatus =  async (req, res) => {
    console.log("req",req.params.transactionId)
    const otp = await OTPSchema.findById(req.params.transactionId);
    console.log("OTP",otp)
    if (!otp) return res.status(404).json({ step: "login" });

    const now = new Date();
    const timeLeft = Math.max(0, Math.floor((otp.expiredAt - now) / 1000)); // seconds

    if (otp.verified) {
        return res.json({ step: "done" });
    }

    if (timeLeft === 0) {
        return res.json({ step: "login" });
    }

    return res.json({ step: "otp", timeLeft });
}


////Fake
export const resendOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        // فیک: کاربر رو پیدا کن یا بساز
        let user = await User.findOne({ phoneNumber });
        if (!user) {
            user = new User({ phoneNumber });
            await user.save();
        }

        // فیک: همیشه OTP ثابت باشه
        const fakeOtp = "123456";

        // آپدیت زمان انقضای OTP برای 2 دقیقه بعد
        user.otp = fakeOtp;
        user.otpExpires = new Date(Date.now() + 2 * 60 * 1000);
        await user.save();

        const timeLeft = Math.floor((user.otpExpires - new Date()) / 1000);

        return res.status(201).json({
            message: "Fake OTP resent successfully",
            phoneNumber,
            otp: fakeOtp, // ⚠️ فقط برای تست — بعداً باید حذف بشه
            expiredAt: timeLeft,
        });
    } catch (err) {
        console.error("Resend OTP error:", err);
        res.status(500).json({ message: "Server error" });
    }
};







///Temp Commented

// export const resendOtp = async (req , res)=>{
//         try {
//             const { phoneNumber } = req.body;
//             if (!phoneNumber) {
//                 return res.status(400).json({ message: "Phone number is required" });
//             }
//
//             const user = await User.findOne({ phoneNumber });
//             if (!user) {
//                 return res.status(404).json({ message: "User not found" });
//             }
//
//             // Check if OTP is still valid
//             if (user.otpExpires && Date.now() < user.otpExpires.getTime()) {
//                 const waitSeconds = Math.ceil((user.otpExpires.getTime() - Date.now()) / 1000);
//                 return res.status(400).json({
//                     message: `Please wait ${waitSeconds} seconds before requesting a new OTP`
//                 });
//             }
//
//             // Generate new OTP
//             const newOtp = generateOTP();
//             const hashedOtp = await bcrypt.hash(newOtp, 10);
//             const savedOtpDb = await OTPSchema.create({phone:phoneNumber , otp: hashedOtp})
//             user.otp = newOtp;
//             user.otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
//             const timeLeft = Math.floor((user.otpExpires - new Date()) / 1000);
//             await user.save();
//
//             const otpSent = await sendOTPSMS(phoneNumber, newOtp);
//             if (!otpSent) {
//                 await User.deleteOne({ otpSent });
//                 return res.status(500).json({ error: 'Failed to send OTP email' });
//             } else {
//                 res.status(201).json({
//                     message: 'OTP sent to phone number. Please verify to complete registration.',
//                     phoneNumber,
//                     expiredAt:timeLeft,
//                     transActionId:savedOtpDb._id.toString()
//                 });
//             }
//
//             res.json({ message: "New OTP sent successfully" });
//         } catch (err) {
//             console.error(err);
//             res.status(500).json({ message: "Server error" });
//         }
//
// }