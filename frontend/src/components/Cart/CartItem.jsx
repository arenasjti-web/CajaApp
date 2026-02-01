import React from 'react'
import { Trash2 ,Copy} from 'lucide-react'
import api from '../../lib/axios'

export const CartItem = ({data,saleId,onDelete,onQuantityChange,setItems}) => {

    //const [quantity,setQuantity] = React.useState(data.quantity)
    const[priceToggle,setPriceToggle] = React.useState("regular")
    const [quantityInput,setQuantityInput] = React.useState("1")
    
    const handleQuantity = async (delta,newQuantity)=>{
       
        try {
            // si delta vino de los botones. se cambiara 1 o -1 a la cantidad. si es otro valor entonces quiero reemplazar de golpe ese valor
            const body={}
            if(delta!=null) body.delta = delta
            
            if(newQuantity!=null)body.newQuantity = newQuantity
            
            
            const res = api.put(`/cart/sales/${saleId}/items/${data.itemId}`,body)
            onQuantityChange(data.sku,body.delta,body.newQuantity)
        } catch (error) {
            console.log("error cambiado cantidad de item",error)
        }
    }
    React.useEffect(() => {
      setQuantityInput(String(data.quantity));
    }, [data.quantity]);

    const handleInputChange = (e) => {
    const value = e.target.value;

    if (priceToggle === "ppm") {
        // acepta números decimales y estados intermedios
        if (/^\d*\.?\d*$/.test(value)) {
        setQuantityInput(value);
        }
    } else {
        // solo enteros
        if (/^\d*$/.test(value)) {
        setQuantityInput(value);
        }
    }
    };

    const commitQuantity = () => {
    if (quantityInput === "") {
        setQuantityInput(String(data.quantity));
        return;
    }

    const value = Number(quantityInput);

    if (!Number.isFinite(value)) {
        setQuantityInput(String(data.quantity));
        return;
    }

    // acá recién decides si aceptas 0 o no
    handleQuantity(null,value);
    };


    const deleteRow = ()=>{
        onDelete(data.sku)
    }

    const handleToggleChange = (pricingMode)=>{
        setPriceToggle(pricingMode)
        setItems(prev =>
            prev.map(item =>
                item.id === data.id
                ? {
                    ...item,
                    pricingMode: pricingMode,
                    priceAtSale: item.prices[pricingMode]// aqui
                    }
                : item
            )
        )
    }

  return (
    <div className="
        grid
        grid-cols-[2fr_0.5fr_1fr_1fr]
        items-center
        px-4
        py-3
        hover:bg-base-200/40
        transition
        gap-0.5
        
        "
    >
        {/**Secciones */}
        {/**Info Text */}
        <div className="flex flex-col gap-0.5 ml-1 md:ml-20">
           <div className="flex items-center gap-2 max-w-30">
                <span className="text-xs text-base-content/50 truncate">
                    {`SKU ${data?.sku}`}
                </span>

                <button
                    type="button"
                    className="btn btn-ghost btn-xs p-1"
                    onClick={() => navigator.clipboard.writeText(data.sku)}
                    aria-label="Copiar SKU"
                >
                    <Copy size={14} />
                </button>
            </div>

            <span className="font-semibold leading-tight">
                {data.nameSnapshot}
            </span>

            <span className="text-xs text-base-content/60">
                {data.brand ?? "--"}
            </span>
        </div>

        {/** Precio a usar */}
        <div className="
            flex flex-col
            items-center
            space-y-2
            md:flex-row
            md:space-y-0
            md:space-x-2
        ">
           
            {/* Opción Precio Base ( tipicamente por paquete/unidad ) */}
            <label className="tooltip cursor-pointer" data-tip="Precio por Unidad">
                <input
                    type="radio"
                    name="options"
                    value="$$"
                    aria-label="$$"
                    onChange={(e) => handleToggleChange("regular")}
                    className="hidden"
                    checked={priceToggle === "regular"}

                />
                <div  className={`px-3 py-1 rounded-full border border-gray-300 text-sm font-medium text-center shadow-sm
                                transition-colors duration-200
                                ${priceToggle === 'regular' ? 'bg-green-700/80 text-white' : 'bg-white text-gray-800'}
                                hover:bg-green-50`}
                >
                    $$
                </div>
            </label>
             {/** Opción Precio por Unidad en caso de venderse suelto*/}
            <label className="tooltip cursor-pointer" data-tip="Precio por Medida">
                <input
                type="radio"
                name="options"
                value="kg"
                aria-label="kg"
                onChange={(e) => handleToggleChange("ppu")}
                disabled={!data.prices?.ppu}
                className="hidden"
                checked={priceToggle === "ppu"}

                />
                <div
                className={`px-3 py-1 rounded-full border border-gray-300 text-sm font-medium text-center shadow-sm
                            transition-colors duration-200
                            ${priceToggle === 'ppu' ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}
                            hover:bg-green-50
                            ${!data.prices?.ppu ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                C/U
                </div>
            </label>       
            {/* Opción Precio por Medida */}
            <label className="tooltip cursor-pointer" data-tip="Precio por Medida">
                <input
                type="radio"
                name="options"
                value="kg"
                aria-label="kg"
                onChange={(e) => handleToggleChange("ppm")}
                disabled={!data.prices?.ppm}
                className="hidden"
                checked={priceToggle === "ppm"}

                />
                <div
                className={`px-3 py-1 rounded-full border border-gray-300 text-sm font-medium text-center shadow-sm
                            transition-colors duration-200
                            ${priceToggle === 'ppm' ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}
                            hover:bg-green-50
                            ${!data.prices?.ppm ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                kg
                </div>
            </label>
        </div>

        {/**Cantidad */}
       <div className='flex flex-col items-center'>
            <div className="flex items-center rounded-lg px-2">
                <button
                    className="px-2 py-1 text-gray-500 hover:bg-base-200 rounded-full disabled:opacity-30"
                    onClick={()=>handleQuantity(-1,null)}
                >
                    −
                </button>

               <input
                    type="number"
                    step="any"
                    value={quantityInput}
                    onChange={handleInputChange}
                    onBlur={() => commitQuantity()}
                    min={0}
                    className="
                        w-10
                        text-center
                        bg-transparent
                        border-none
                        outline-none
                        text-sm
                        font-semibold
                        tabular-nums
                        appearance-none
                        [-moz-appearance:textfield]
                        [&::-webkit-outer-spin-button]:appearance-none
                        [&::-webkit-inner-spin-button]:appearance-none
                    "
                />


                <button
                    className="px-2 py-1 text-gray-500 hover:bg-base-200 rounded-full disabled:opacity-30"
                    onClick={()=>handleQuantity(1,null)}
                >
                    +
                </button>
            </div>
            <div className='text-center'>
               <button
                    type="button"
                    className="flex justify-center items-center gap-1 btn btn-ghost"
                    onClick={deleteRow}
                    >
                    Eliminar
                    <Trash2 size={15} color="red" />
                </button>
            </div>
       </div>
        {/**precio */}
        <div className="
            justify-self-end
            font-semibold
            tabular-nums
            text-sm
            md:text-base
            ">
            {`$${data.priceAtSale * data.quantity}`}
        </div>


    </div>
  )
}
