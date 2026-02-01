import express from "express"   
import multer from "multer";
import { addOneToInventory, getInventory, updateItem, deleteItem, getOneItem, getProdivers, getBrands, addBrandOrProvider, getInventoryStats, importCsv } from "../../controllers/inventoryController.js";

const Router = express.Router()
const upload = multer({ dest: "uploads/" });


Router.get("/",getInventory)

Router.get("/provider",getProdivers)
Router.get("/brand",getBrands)
Router.get("/stats",getInventoryStats)
Router.get("/:sku",getOneItem)// /:param se come otras rutas, colocarlo luego de estas

Router.post("/",addOneToInventory)
Router.post("/importCsv",upload.single("file"),importCsv)
Router.post("/brandProvider",addBrandOrProvider)
Router.put("/:sku",updateItem)
Router.delete("/delete/:sku",deleteItem)


export default Router;