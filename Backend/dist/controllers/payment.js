import { myCache, stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";
export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount } = req.body;
    if (!amount) {
        return next(new ErrorHandler("Please enter amount", 400));
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
    });
    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});
export const newCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount } = req.body;
    //   console.log(coupon, amount);
    if (!coupon || !amount) {
        return next(new ErrorHandler("Please enter both coupon and amount", 400));
    }
    await Coupon.create({ coupon, amount });
    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} created successfully`,
    });
});
export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;
    //   console.log(coupon, amount);
    if (!coupon) {
        return next(new ErrorHandler("Please enter coupon", 400));
    }
    const discount = await Coupon.findOne({ coupon: coupon });
    if (!discount) {
        return next(new ErrorHandler("Invalid Coupon Code", 400));
    }
    return res.status(201).json({
        success: true,
        message: `Discount fetched successfully`,
        discount: discount.amount,
    });
});
export const allCoupons = TryCatch(async (req, res, next) => {
    let coupons;
    const key = "all-coupons";
    if (myCache.has(key)) {
        coupons = JSON.parse(myCache.get(key));
    }
    else {
        coupons = await Coupon.find({});
        myCache.set(key, JSON.stringify(coupons));
    }
    return res.status(200).json({
        success: true,
        coupons,
        message: "All coupons fetched successfully",
    });
});
export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
        return next(new ErrorHandler("Invalid Coupon", 400));
    }
    return res.status(200).json({
        success: true,
        message: "Coupon Deleted Successfully",
    });
});
