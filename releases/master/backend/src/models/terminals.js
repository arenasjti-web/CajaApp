import mongoose from "mongoose"

const terminalSchema = new mongoose.Schema(
  {
    machineId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },

    isMain: {
        type: Boolean,
        default: false
    },

    // opcional, pero útil a futuro
    description: {
        type: String,
        default: ""
    }
  },
  {
    timestamps: true
  }
)

/*
  Regla clave del sistema:
  Solo puede existir UNA terminal con isMain = true
*/
terminalSchema.index(
  { isMain: 1 },
  {
    unique: true,
    partialFilterExpression: { isMain: true }
  }
)

export default mongoose.model("Terminal", terminalSchema)
