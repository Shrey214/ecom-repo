import mongoose from "mongoose";

const schema = new mongoose.Schema({
  coupon: {
    type: String,
    required: [true, "Please enter the coupon code"],
  },
  amount: {  
    type: Number,
    required: [true, "Please enter discount amount"],
  },
});

export const Coupon = mongoose.model("Coupon", schema);
