import mongoose from "mongoose";

// para guardarme los posibles precios del producto. se decide cual se guarda como priceAtsale al concretar la venta
const PriceSchema = new mongoose.Schema(
{
  regular: {
    type: Number,
    min: 1,
    required: true
  },

  ppu: {
    type: Number,
    min: 1,
    default: null
  },

  ppm: {
    type: Number,
    min: 1,
    default: null
  }
},
{ _id: false }
)


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
    prices: {
      type: PriceSchema,
      required: true
    },
    pricingMode: {
      type: String,
      enum: ["regular", "ppu", "ppm"],
      required: true,
      default:"regular"
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
    },
    content:{// solo necesario si hay ppm o ppu
      type:Number,
      min:1
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
