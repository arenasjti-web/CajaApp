import app from "./app.js"
import { connectDB } from "../config/db.js";
import "dotenv/config";// forma explicita
//dotenv.config();ya no hace falta


const PORT = process.env.PORT || 5001

app.listen(PORT,()=>{
    console.log("Server started in Port",PORT)
})

connectDB().then( ()=>{
    app.listen(5001,()=>{
        console.log("Server started n PORT:", PORT);
    })

})