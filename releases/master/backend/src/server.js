import app from "./app.js"
import { connectDB } from "../config/db.js";
import "dotenv/config";// forma explicita
import cors from "cors"
//dotenv.config();ya no hace falta


const NODE_ROLE = process.env.NODE_ROLE || "master"
// const PORT = process.env.PORT || (NODE_ROLE ==="master"?5001:3000)
const PORT = 5000

if(process.env.Node_ENV !== "production"){
    // app.use(cors({
    //     origin:"http://localhost:5173"
    // }))
    app.use(cors())
}


// solo en produccion
if(process.env.NODE_ENV == "production"){
    //middleware
    // coloca en el mismo dominio al backend y frontend
    // de paso tambien evita errores de cors
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res)=>{
    // 
    res.sendFile(path.join(__dirname,"../frontend/dist","index.html"))
})
}



// conexión segun el PC/ tipo de maquina. principal(master) o trabajador generico
if(NODE_ROLE === "master"){
    import("./routes/master/index.js").then(({ default: mountMaster }) => {
    mountMaster(app)

    connectDB().then(() => {
      app.listen(PORT, () => {
        console.log("MASTER started on PORT:", PORT)
      })
    })
  })
}
else{
    import("./routes/cashier/index.js").then(({ default: mountCashier }) => {
    mountCashier(app)

    app.listen(PORT, () => {
      console.log("WORKER started on PORT:", PORT)
    })
  })
}




