import React from 'react'
import { Trash2 } from 'lucide-react'
import api from '../../lib/axios'

export const CartItem = ({data,saleId,onDelete}) => {

    const [quantity,setQuantity] = React.useState(data.quantity)
    const[priceToggle,setPriceToggle] = React.useState("$$")

    const handleQuantity = async (n)=>{
        var rollback = quantity// nunca hacer esto dentro del setState
        var next;
        setQuantity(prev=>{
            next = (prev+n)
            return next
        })

        if(rollback== 0 && n == -1) return; // evito hacer request
        try {
            // algo que cambia en BD la cantidad
            const res = api.put(`/cart/sales/${saleId}/items/${data.itemId}`,{delta:n})
        } catch (error) {
            setQuantity(rollback)
        }
    }

    const deleteRow = ()=>{
        onDelete(data.sku)
    }

  return (
    <div className="
        grid
        grid-cols-[2fr_0.5fr_1fr_1fr]
        items-center
        px-4
        py-3
        hover:bg-base-200/40
        transition"
    >
        {/**Secciones */}
        {/**Info Text */}
        <div className="flex flex-col gap-0.5 ml-20">
            <span className="text-xs text-base-content/50">
                SKU {data.sku}
            </span>

            <span className="font-semibold leading-tight">
                {data.nameSnapshot}
            </span>

            <span className="text-xs text-base-content/60">
                Marca
            </span>
        </div>

        {/** Precio a usar */}
        <div className="flex items-center space-x-2">
  {/* Opción Precio por Unidad */}
  <label className="tooltip cursor-pointer" data-tip="Precio por Unidad">
    <input
      type="radio"
      name="options"
      value="$$"
      aria-label="$$"
      onChange={(e) => setPriceToggle(e.target.value)}
      defaultChecked
      className="hidden"
    />
    <div
      className={`px-3 py-1 rounded-full border border-gray-300 text-sm font-medium text-center shadow-sm
                  transition-colors duration-200
                  ${priceToggle === '$$' ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}
                  hover:bg-green-50`}
    >
      $$
    </div>
  </label>

  {/* Opción Precio por Medida */}
  <label className="tooltip cursor-pointer" data-tip="Precio por Medida">
    <input
      type="radio"
      name="options"
      value="kg"
      aria-label="kg"
      onChange={(e) => setPriceToggle(e.target.value)}
      disabled={data?.ppu}
      className="hidden"
    />
    <div
      className={`px-3 py-1 rounded-full border border-gray-300 text-sm font-medium text-center shadow-sm
                  transition-colors duration-200
                  ${priceToggle === 'kg' ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}
                  hover:bg-green-50
                  ${data?.ppu ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    onClick={()=>handleQuantity(-1)}
                >
                    −
                </button>

                <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                    {quantity}
                </span>

                <button
                    className="px-2 py-1 text-gray-500 hover:bg-base-200 rounded-full disabled:opacity-30"
                    onClick={()=>handleQuantity(1)}
                >
                    +
                </button>
            </div>
            <div className='text-center'>
                <label className='flex justify-center items-center gap-1 btn btn-ghost' onClick={deleteRow}>
                    Eliminar
                    <Trash2 size={15} color='red'/>
                </label>
            </div>
       </div>
        {/**precio */}
        <div className="justify-self-center font-semibold tabular-nums">
            <span>$123123213</span>
        </div>

    </div>
  )
}
