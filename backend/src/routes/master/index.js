import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import cartRoutes from "./cartRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import rateLimiter from "../../middleware/rateLimiter.js"// 20 en 6 segundos será considerado "mucho" de momento


export default function mountMaster(app) {
    app.use("/api/auth", authRoutes );
    app.use("/api/dashboard",rateLimiter(20,60_000),authMiddleware, dashboardRoutes);
    app.use("/api/cart",rateLimiter(20,60_000),authMiddleware, cartRoutes);
    app.use("/api/inventory",rateLimiter(20,60_000),authMiddleware, inventoryRoutes);

}