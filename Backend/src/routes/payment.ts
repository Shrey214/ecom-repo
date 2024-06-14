import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  allCoupons,
  applyDiscount,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.js";

const app = express.Router();
// path -> /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon);
app.get("/discount", applyDiscount);
app.get("/all", adminOnly, allCoupons);
app.delete("/coupon/:id", adminOnly, deleteCoupon);
export default app;
