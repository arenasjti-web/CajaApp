import app from "./app.js"
import { connectDB } from "../config/db.js";
import "dotenv/config";// forma explicita
//dotenv.config();ya no hace falta


const NODE_ROLE = process.env.NODE_ROLE || "MASTER"
const PORT = process.env.PORT || (NODE_ROLE ==="MASTER"?5001:3000)


if(NODE_ROLE === "Master"){
    // Master Endpoint
    connectDB().then( ()=>{
    app.listen(PORT,()=>{
        console.log("Server started en PORT:", PORT);
    })

})
}
else{
    // Cashier Endpoint
     app.listen(PORT,()=>{
        console.log("Server started en PORT:", PORT);
    })
}




