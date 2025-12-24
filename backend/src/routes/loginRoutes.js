import express from "express"
import { login } from "../controllers/loginControllers.js";

const Router = express.Router()

/*Controllers */
/*Deberia tener un login y quiza un register( quiza ni agregue esto) */


Router.post("/",login)

export default Router;