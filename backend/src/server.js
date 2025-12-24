import app from "./app.js"
import "dotenv/config";// forma explicita
//dotenv.config();ya no hace falta


const PORT = process.env.PORT || 5001

app.listen(PORT,()=>{
    console.log("Server started in Port",PORT)
})