import express from "express"
import { createSale, getItemDetails, processSale, saveSale } from "../../controllers/cartController.js";

const Router = express.Router()

Router.post("/",createSale)

Router.get("/",getItemDetails)

Router.put("/:id",saveSale)


Router.post("/:id",processSale)

export default Router;