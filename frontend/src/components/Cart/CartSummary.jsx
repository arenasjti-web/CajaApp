import React from 'react'

export const CartSummary = ({total}) => {
  return (
    <div className="
      /* PEQUEÑO (base) */
      rounded-tl-2xl rounded-bl-2xl rounded-br-2xl   /* sin TR */

      /* MEDIO */
      sm:rounded-t-none
      sm:rounded-bl-2xl sm:rounded-br-2xl

      /* GRANDE */
      lg:rounded-2xl

      flex flex-col gap-6 w-full bg-green-50 p-6 shadow-sm"
    >
      <h2 className="text-center text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Resumen de Venta
      </h2>

      <div className="flex flex-col justify-between items-center  lg:flex-row w-full">
        <span>Total de Venta:</span>
        <span className="font-bold text-green-600">{`$${total}`}</span>
      </div>

      <div className="flex flex-col xl:flex-row gap-3 w-full">
        <button className="btn btn-success w-full sm:flex-1 min-w-0 truncate">Procesar Venta</button>
        <button className="btn btn-error w-full sm:flex-1 min-w-0 truncate border border-gray-300">Cancelar Venta</button>
      </div>
    </div>

  )
}
