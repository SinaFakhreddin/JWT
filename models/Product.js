import mongoose from "mongoose";



const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    category: String,
    flowers: [{ type: String }],
}, { timestamps: true });


export default mongoose.model("Product", ProductSchema);
