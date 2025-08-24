import mongoose from "mongoose";
import bcrypt from "bcrypt";

 const OTPSchema = new mongoose.Schema({
    identifier: { // This will be the phone number or email
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 180, // The document will automatically delete after 300 seconds (5 minutes)
    }
});


OTPSchema.pre('save', async function(next) {
    if (!this.isModified('otp')) return next();
    this.otp = await bcrypt.hash(this.otp, 12);
    next();
});

OTPSchema.methods.correctOTP = async function(candidateOTP, userOTP) {
    return await bcrypt.compare(candidateOTP, userOTP);
};

export default mongoose.model("OTP" , OTPSchema)