import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "7d" }, // بعد ۷ روز حذف میشه
});

export default mongoose.model("Token", tokenSchema);
