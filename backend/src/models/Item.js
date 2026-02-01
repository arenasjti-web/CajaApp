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
    content:{
      type:Number,
      min:0
    },
    ppu:{// Precio Por Unidad 
      type: Number,
      min: 0
    },
    ppm:{ // precio por medida
      type: Number,
      min: 0
    },
   items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true
        },
        qty: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],
    // packPrice:{
    //   type: Number,
    //   min: 0
    // }
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
