import Mongoose from "mongoose"

// luego veo que mas me hace falta
const userSchema  = new Mongoose.Schema({

    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
},{timestamps:true})// te devuelve el createdAt y updatedAt), ni idea si me hace falta pero porque no de momento

const User = Mongoose.model("Users",userSchema)

export default User