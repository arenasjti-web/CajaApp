import express from "express"
import { addItemToCart, deleteCartRow, getItemDetails, getOrCreateCart, processSale, saveSale, updateItemQuantity } from "../../controllers/cartController.js";

const Router = express.Router()

Router.post("/",getOrCreateCart)

Router.post("/sales/:saleId/items/:sku",addItemToCart)

Router.put("/sales/:saleId",processSale)

Router.get("/",getItemDetails)

Router.put("/:id",saveSale)

Router.put("/sales/:saleId/items/:itemId",updateItemQuantity)

Router.delete("/sales/:saleId/items/:itemId",deleteCartRow)


export default Router;