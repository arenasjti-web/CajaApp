import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectDBCloud = async ( )=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB CONNECTED SUCCESSFULLY!")
    }catch(error){
        console.error("ERROR CONNECTING MONGODB"+error)
    }
}

// por como me doy internet por usb tethering no puedo usar atlas asi que aqui una version en local
const connectDBLocal = async ( )=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB CONNECTED SUCCESSFULLY!")
    }catch(error){
        console.error("ERROR CONNECTING MONGODB"+error)
        process.exit(1);//exit with failure
    }
}

export const connectDB = async()=>{
    if(process.env.NODE_ENV === "production"){
        return connectDBCloud()
    }
    else{
        return connectDBLocal()
    }
}