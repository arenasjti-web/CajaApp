import express from "express"
import { addOneToInventory, getInventory,addManyToInventory, updateItem, deleteItem, getOneItem, getProdivers, getBrands, addBrandOrProvider, getInventoryStats } from "../../controllers/inventoryController.js";

const Router = express.Router()


Router.get("/",getInventory)

Router.get("/provider",getProdivers)
Router.get("/brand",getBrands)
Router.get("/stats",getInventoryStats)
Router.get("/:sku",getOneItem)// /:param se come otras rutas, colocarlo luego de estas

Router.post("/",addOneToInventory)
Router.post("/bulk",addManyToInventory)
Router.post("/brandProvider",addBrandOrProvider)
Router.put("/:sku",updateItem)
Router.delete("/delete/:sku",deleteItem)


export default Router;