import OTPSchema from "../models/Otp.js";
import * as NextResponse from "express";
import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const getSingleProduct =  async (req, res) => {
    console.log(req , res)
}


export const getAllProducts =async (req , res) => {
    try {
        console.log("FUCKING");
        console.log("Query:", req.query);

        const { category, minPrice, maxPrice, search, flower, page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        let filter = {};
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) filter.name = { $regex: search, $options: "i" };
        if (flower) filter.flowers = { $regex: flower, $options: "i" };

        const [products, total] = await Promise.all([
            Product.find(filter).skip(skip).limit(limitNum),
            Product.countDocuments(filter),
        ]);

        return res.json({
            success: true,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total,
            itemsPerPage: limitNum,
            data: products,
        });
    } catch (error) {
        console.log("CATCH", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const createProducts = async (req , res)=>{
    try {

        console.log("req",req)
        const { name, price, description, category, flowers } = req.body;

        let imageUrl = null;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "products" }, // پوشه در Cloudinary
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });

            imageUrl = result.secure_url;
        }

        const newProduct = new Product({
            name,
            price,
            description,
            category,
            flowers: flowers ? flowers.split(",") : [],
            image: imageUrl,
        });

        await newProduct.save();

        res.json({ success: true, data: newProduct });
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ success: false, message: err.message });
    }

}