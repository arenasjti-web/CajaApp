import express from "express"
import { addOneToInventory, getInventory,addManyToInventory } from "../controllers/inventoryController.js";

const Router = express.Router()

Router.get("/",getInventory)
Router.post("/",addOneToInventory)
Router.post("/",addManyToInventory)
export default Router;