import express from "express"
import { login,register } from "../../controllers/authControllers.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const Router = express.Router()

/*Controllers */
/*Deberia tener un login y quiza un register( quiza ni agregue esto) */


Router.post("/login",login)
Router.post("/signin",register)

export default Router;