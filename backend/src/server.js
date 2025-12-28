import app from "./app.js"
import { connectDB } from "../config/db.js";
import "dotenv/config";// forma explicita
//dotenv.config();ya no hace falta


const NODE_ROLE = process.env.NODE_ROLE || "master"
const PORT = process.env.PORT || (NODE_ROLE ==="master"?5001:3000)


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




