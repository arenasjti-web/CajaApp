import express from "express"
import {fetchAllSales, fetchRevenue, fetchStats,fetchSale} from "../../controllers/dashboardController.js"
const Router = express.Router()


Router.get(`/revenue/`,fetchRevenue)
Router.get(`/sales/`,fetchAllSales)
Router.get(`/sale/:saleId`,fetchSale)

Router.get(`/stats`,fetchStats)

export default Router;