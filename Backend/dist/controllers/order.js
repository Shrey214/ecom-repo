import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
export const myOrders = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    const key = `my-orders-${user}`;
    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key));
    }
    else {
        orders = await Order.find({ user });
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
        message: "Orders fetched successfully",
    });
    // console.log("success");
});
export const allOrders = TryCatch(async (req, res, next) => {
    let orders = [];
    if (myCache.has("all-orders")) {
        orders = JSON.parse(myCache.get("all-orders"));
    }
    else {
        orders = await Order.find({}).populate("user", "name");
        myCache.set("all-orders", JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
        message: "All Orders fetched successfully",
    });
    // console.log("success");
});
export const getSingleOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const key = `order-${id}`;
    let data;
    if (myCache.has(key)) {
        data = JSON.parse(myCache.get(key));
    }
    else {
        data = await Order.findById(id).populate("user", "name");
        if (!data) {
            return next(new ErrorHandler("Order not found", 404));
        }
        myCache.set(key, JSON.stringify(data));
    }
    return res.status(200).json({
        success: true,
        data,
        message: "Order Details fetched successfully",
    });
});
export const newOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
    if (!shippingInfo ||
        !orderItems ||
        !user ||
        !subtotal ||
        !tax ||
        !shippingCharges ||
        !discount ||
        !total) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    const order = await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    await reduceStock(orderItems);
    await invalidateCache({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: order.orderItems.map((item) => String(item.productId)),
    });
    return res.status(201).json({
        success: true,
        message: "Order Placed Successfully",
    });
    // console.log("success");
});
export const processOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    await order.save();
    await invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res.status(201).json({
        success: true,
        message: "Order Processed Successfully",
    });
    // console.log("success");
});
export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }
    await order.deleteOne();
    await invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res.status(201).json({
        success: true,
        message: "Order Deleted Successfully",
    });
    // console.log("success");
});
