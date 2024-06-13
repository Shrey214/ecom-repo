import express from "express";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();
// path -> /api/v1/order/new
// app.post("/coupon/new", newCoupon);
export default app;
