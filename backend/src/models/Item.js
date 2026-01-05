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
      ref:"Brand",
      trim: true
    },
    provider:{
      type: String, 
      ref:"Provider",
      trim: true
    },
    unit:{
      type:String,
      trim:true
    },
    ppu:{// Precio Por Unidad ( de medida )
      type: Number,
      min: 0
    },
    packItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null
    },
    // packPrice:{
    //   type: Number,
    //   min: 0
    // }
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
