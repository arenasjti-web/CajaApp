import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 0,
      min: 0
    }, 
    brand:{
      type: String, 
      trim: true
    },
    provider:{
      type: String, 
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
