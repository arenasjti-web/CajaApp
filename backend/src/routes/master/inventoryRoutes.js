import express from "express"
import { addOneToInventory, getInventory,addManyToInventory, updateItem, deleteItem } from "../../controllers/inventoryController.js";

const Router = express.Router()

Router.get("/",getInventory)
Router.post("/",addOneToInventory)
Router.post("/bulk",addManyToInventory)
Router.put("/update/:sku",updateItem)
Router.delete("/delete/:sku",deleteItem)
export default Router;