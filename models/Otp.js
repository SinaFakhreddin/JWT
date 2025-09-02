import mongoose from "mongoose";
import bcrypt from "bcrypt";

 const OTPSchema = new mongoose.Schema({
    phone: { // This will be the phone number or email
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
        expires: 120, // The document will automatically delete after 300 seconds (5 minutes)
    },
     expiredAt:{
        type:Date,
         required:true,
         default: () => Date.now() + 2 * 60 * 1000
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

export default mongoose.model("Otp" , OTPSchema)