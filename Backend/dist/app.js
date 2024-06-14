import express from "express";
import orderRoute from "./routes/orders.js";
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import dashboardRoute from "./routes/stats.js";
import paymentRoute from "./routes/payment.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
config({
    path: "./.env"
});
const DB_URL = process.env.DB_URL || "";
connectDB(DB_URL);
export const myCache = new NodeCache();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
});
