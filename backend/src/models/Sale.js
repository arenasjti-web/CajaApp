import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    nameSnapshot: {
      type: String,
      required: true
    },
    priceAtSale: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["open", "paid", "cancelled"],
      default: "open"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [saleItemSchema],
      default: []
    },
    totalAmount:{
      type:Number,
      min:0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
