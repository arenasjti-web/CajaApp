import express from "express";
// rutas
import loginRoutes from "./routes/loginRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/login", loginRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/inventory", inventoryRoutes);

// ruta de salud para revisar si está vivo el backend en testing
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});


// configuro express 
export default app;
