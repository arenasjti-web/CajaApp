import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
    // obtiene el token  
    const authHeader = req.headers.authorization
    // verifica que existe
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado" })
    }
    // el token suele ser "bearer sdasdasdasd", esto toma el " asdasdasdasd"
    const token = authHeader.split(" ")[1]

    try {
        // decodifica, si todo sale bien prosigue
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ error: "Token inválido o expirado" })
    }
}
