import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
import { myCache } from "../app.js";
export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "Ecommerce",
    })
    .then((c) => console.log(`Db connected to ${c.connection.host}`))
    .catch((e) => console.log(`Error in connecting with DB`));
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-product",
      "all-products",
      "categories",
    ];
    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    if (typeof productId === "object") {
      productId.forEach((i) => productKeys.push(`product-${i}`));
      // console.log("LOL");
    }

    // const products = await Product.find({}).select("_id");
    // products.forEach((i) => {
    //   productKeys.push(`product-${i._id}`);
    // });
    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];
    myCache.del(orderKeys);
  }
  if (admin) {
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product not found");
    product.stock -= order.quantity;
    await product.save();
  }
};
