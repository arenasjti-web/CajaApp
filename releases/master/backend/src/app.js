import express from "express";
import rateLimiter from "./middleware/rateLimiter.js"

const app = express();

app.use(express.json());
app.set("trust proxy", true)// sin esto asume que la conexión es directa y no toma la ip real del cliente al leerla desde la request

// ruta de salud para revisar si está vivo el backend en testing
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});


// configuro express 
export default app;
