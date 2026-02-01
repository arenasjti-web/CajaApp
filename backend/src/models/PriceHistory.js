import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema(
    {
        item:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },
        price:{
            type:Number,
            required:true
        }
    }
)

export default mongoose.model("PriceHistory", priceHistorySchema);