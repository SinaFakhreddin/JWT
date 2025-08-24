import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import {validationResult} from "express-validator";

//after
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false, // or true if email is mandatory
        unique: true,
        sparse: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'شماره موبایل اجباری است'],
        match: [/^09(0[1-5]|1[0-9]|2[0-9]|3[0-9]|9[0-9])[0-9]{7}$/, 'لطفاً یک شماره موبایل معتبر وارد کنید']
    },
    passwordChangedAt: Date,
    failedLoginAttempts: { type: Number, default: 0 },
    accountLockedUntil: Date,
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
        expires:"2min"
    },
    otpExpires:{
        type:Date
    },
    refreshTokens: [{
        token: String,
        expires: Date
    }]

}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Lock account after 5 failed attempts
UserSchema.methods.incrementLoginAttempts = async function () {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5) {
        this.accountLockedUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
    }
    await this.save();
};



export default mongoose.model('User', UserSchema);













//////// before
// const userSchema = new mongoose.Schema({
//     email: { type: String, unique: true },
//     password: { type: String },
// });
//
// // رمزنگاری پسورد قبل از ذخیره
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });
//
// // متد مقایسه پسورد
// userSchema.methods.comparePassword = function (password) {
//     return bcrypt.compare(password, this.password);
// };
//
// export default mongoose.model("User", userSchema);
