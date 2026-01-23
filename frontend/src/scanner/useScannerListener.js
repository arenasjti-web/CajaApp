import { useEffect } from "react"
import { useScanner } from "./ScannerContext"

export function useScannerListener() {
  const { setScan } = useScanner();

  useEffect(() => {
    let buffer = "";
    let timer;

    const onKeyDown = (e) => {
      // Ignorar si el foco está en un input o textarea
      const target = e.target;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key === "NumLock") return// cosa que el scanner coloca al inicio y final porque está mal configurado y perdí la hoja

      // Acumula la tecla
      buffer += e.key;

      // Reinicia el timer
      clearTimeout(timer);

      // Si NO llega más tecla dentro de X ms → terminó
      timer = setTimeout(() => {
        if (buffer.length > 3) {
          setScan(buffer);
        }
        buffer = "";
      }, 40);
    };

    window.addEventListener("keydown", onKeyDown);
   
    return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", onKeyDown);
    };
    
  }, [setScan]);
}
