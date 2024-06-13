import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, stock, price, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please upload photo", 400));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("Uploaded photo deleted successfully");
        });
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    return res.status(201).json({
        success: true,
        message: "Product created successfully",
    });
});
export const getLatestProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({
        success: true,
        products,
        message: "Latest products fetched successfully",
    });
});
export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({
        success: true,
        categories,
        message: "Categories fetched successfully",
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({
        success: true,
        products,
        message: "All products fetched successfully",
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product Not Found", 404));
    return res.status(200).json({
        success: true,
        product,
        message: "Single Product fetched successfully",
    });
});
export const updateProductById = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const { name, category, stock, price } = req.body;
    const photo = req.file;
    console.log("Name -> ", name);
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product Not Found", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log("old photo deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (category)
        product.category = category;
    if (stock)
        product.stock = stock;
    if (price)
        product.price = price;
    await product.save();
    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product Not Found", 404));
    rm(product.photo, () => {
        console.log("Product photo deleted");
    });
    await Product.deleteOne();
    return res.status(200).json({
        success: true,
        product,
        message: "Product deleted successfully",
    });
});
