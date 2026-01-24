import express from "express"

const router = express.Router()

const MASTER_URL = process.env.MASTER_URL || "http://localhost:5001"

// arma la solicitud al server ya que no tiene acceso al backend por su cuenta
router.use( async (req, res) => {
  try {
    const response = await fetch(
      `${MASTER_URL}${req.originalUrl}`,
      {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": req.headers.authorization
        },
        body:
          req.method !== "GET"
            ? JSON.stringify(req.body)
            : undefined
      }
    )

    const data = await response.json()
    res.status(response.status).json(data)

  } catch (err) {
    res.status(502).json({ error: "Master unreachable" })
  }
})


export default function mountCashier(app) {
    // router arma toda consulta independiente de la url y la redirecciona al servidor
    app.use("/api", router)
  

}