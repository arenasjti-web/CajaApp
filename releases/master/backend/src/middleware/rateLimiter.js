// este es un rateLimiter por Ip en lugar de algún tipo de id

const requests = new Map()// si esto queda afuera funciona como una variable estatica entre cada llamada a rateLimiter y opera siempre que el servicio de node esté vivo

const rateLimiter = (limit, windowMs) => {
  return (req, res, next) => {
    const key = req.ip
    const now = Date.now()

    // si la ip no ha solicitado antes la ingresamos partiendo de 1 y salimos
    if (!requests.has(key)) {
      requests.set(key, { count: 1, start: now })
      return next()
    }

    // caso opuesto conseguimos la ip
    const entry = requests.get(key)

    // si entre que se agregó esa request y ahora a pasado mas que lo que definimos en windowMs entonces está bien y reseteamos.
    // no han habido muchas request en poco tiempo por parte de esta ip. salimos
    if (now - entry.start > windowMs) {
      requests.set(key, { count: 1, start: now })
      return next()
    }

    // si el conteo supera el limite recibido tira error
    if (entry.count >= limit) {
      return res.status(429).json({ message: "Too many requests" })
      // usar este return para algun efecto visual luego
    }

    //aumentamos el contador en caso de que haya sido una request ocurrida muy pronto luego de la anterior
    entry.count++
    next()
  }
}

export default rateLimiter;