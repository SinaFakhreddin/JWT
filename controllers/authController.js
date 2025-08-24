import User from "../models/User.js";
import Token from "../models/Token.js";
import {generateAccessToken, generateRefreshToken,} from "../utils/token.js";
import jwt from "jsonwebtoken";
import {sendOTPSMS} from "../services/smsServices.js";
import bcrypt from "bcrypt";


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};



export const otpRequest = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        console.log("req",phoneNumber)
        if (!phoneNumber) return res.status(400).json({ message: "Phone is required" });
        let user = await User.findOne({ phoneNumber });
        if (!user) {
            user = new User({ phoneNumber });
        }
        const otp = generateOTP();
         // 🔒 hash OTP
        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
        await user.save();
        const otpSent = await sendOTPSMS(phoneNumber, otp);
        if (!otpSent) {
            await User.deleteOne({ otpSent });
            return res.status(500).json({ error: 'Failed to send OTP email' });
        } else {
            res.status(201).json({
                message: 'OTP sent to phone number. Please verify to complete registration.',
                phoneNumber,
                expiredAt:user.otpExpires
            });
        }
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
};

export const verifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshTokens.push(refreshToken);
    user.isVerified=true
    await user.save();
    console.log("Token",accessToken , refreshToken)
    // // ذخیره refreshToken در DB
    await new Token({ userId: user._id, token: refreshToken.token }).save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({accessToken });

};

export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(403);

    const stored = await Token.findOne({ token: refreshToken });
    if (!stored) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env["REFRESH_SECRET"], (err, user) => {
        if (err) return res.sendStatus(403);

        const newAccessToken = generateAccessToken({ _id: user.id, username: user.username });
        res.json({ accessToken: newAccessToken });
    });
};

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    await Token.findOneAndDelete({ token: refreshToken });
    res.clearCookie("refreshToken");
    res.sendStatus(204);
};


export const resendOtp = async (req , res)=>{
        try {
            const { phoneNumber } = req.body;
            if (!phoneNumber) {
                return res.status(400).json({ message: "Phone number is required" });
            }

            const user = await User.findOne({ phoneNumber });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if OTP is still valid
            if (user.otpExpires && Date.now() < user.otpExpires.getTime()) {
                const waitSeconds = Math.ceil((user.otpExpires.getTime() - Date.now()) / 1000);
                return res.status(400).json({
                    message: `Please wait ${waitSeconds} seconds before requesting a new OTP`
                });
            }

            // Generate new OTP
            const newOtp = generateOTP();
            user.otp = newOtp;
            user.otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
            await user.save();

            const otpSent = await sendOTPSMS(phoneNumber, newOtp);
            if (!otpSent) {
                await User.deleteOne({ otpSent });
                return res.status(500).json({ error: 'Failed to send OTP email' });
            } else {
                res.status(201).json({
                    message: 'OTP sent to phone number. Please verify to complete registration.',
                    phoneNumber,
                    expiredAt:user.otpExpires
                });
            }

            res.json({ message: "New OTP sent successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }

}