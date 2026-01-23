import { ChevronDown } from "lucide-react"

export const SelectCategories = () => {
     const CATEGORY_COLORS = {
        Bebidas: "#3b82f6",        // azul sobrio (agua, bebidas)
        Alcohol: "#7c3aed",        // violeta oscuro (vino/licores)
        Dulces: "#eab308",         // amarillo mostaza (no chillón)
        Ferreteria: "#6b7280",     // gris acero
        Charcutería: "#dc2626",    // rojo profundo (carnes)
        Higiene: "#10b981",        // verde menta oscuro
        Otros: "#9ca3af"           // gris neutro
    };
  return (
    <div className="relative ">
        <select
                name="category"
                className="
                    select select-bordered join-item 
                    flex-1 pr-10
                    focus:outline-none
                    focus:ring-0
                    focus:ring-offset-0
                   
                "
                style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    backgroundImage: "none",
                }}
            >
            <option value="">Categoría</option>
            <option>Bebidas</option>
            <option>Alcohol</option>
            <option>Dulces</option>
            <option>Ferretería</option>
            <option>Charcutería</option>
            <option>Higiene</option>
            <option>Otros</option>
        </select>

        <ChevronDown
            size={16}
            className="
                pointer-events-none
                absolute right-3 top-1/2
                -translate-y-1/2
                text-base-content/60
            "
        />
    </div>
  )
}
