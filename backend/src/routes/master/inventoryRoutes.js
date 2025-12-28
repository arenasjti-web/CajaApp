import express from "express"
import { addOneToInventory, getInventory,addManyToInventory, updateItem } from "../../controllers/inventoryController.js";

const Router = express.Router()

Router.get("/",getInventory)
Router.post("/",addOneToInventory)
Router.post("/bulk",addManyToInventory)
Router.put("/update/:id",updateItem)
export default Router;