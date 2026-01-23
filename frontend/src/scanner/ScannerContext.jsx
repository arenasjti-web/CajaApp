import { createContext, useContext, useState } from "react"

/*
  Creamos el contexto (la caja)
*/
const ScannerContext = createContext()

/*
  Este componente ENVUELVE la app
  y define qué datos son globales
*/
export function ScannerProvider({ children }) {
  const [scan, setScan] = useState(null)

  return (
    <ScannerContext.Provider value={{ scan, setScan }}>
      {children}
    </ScannerContext.Provider>
  )
}

/*
  Este hook es solo un atajo
  para acceder al contexto
*/
export function useScanner() {
  return useContext(ScannerContext)
}
