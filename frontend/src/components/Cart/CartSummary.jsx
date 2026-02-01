import React from 'react'

export const CartSummary = ({total,processSale}) => {

  const [showCancelModal, setShowCancelModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [change,setChange] = React.useState(0)

  async function handleSaleProcess(status){

    if (loading) return

    if (status === "cancelled") {
      setShowCancelModal(true)
      return
    }

    setLoading(true)

    try {
      await Promise.all([
        processSale(status),
        minDelay(1200) // 1.2 segundos estéticos
      ])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  React.useState(()=>{

  },[total])

  const minDelay = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms))

  return (
    <>
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Confirmar cancelación</h3>

            <p>¿Seguro que deseas cancelar la venta?</p>

            <div className="flex gap-3 justify-end">
              <button
                className="btn btn-ghost"
                onClick={() => setShowCancelModal(false)}
              >
                Volver
              </button>

              <button
                className="btn btn-error"
                onClick={() => {
                  processSale("cancelled")
                  setShowCancelModal(false)
                }}
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

       <div className="
        /* PEQUEÑO (base) */
        rounded-tl-2xl rounded-bl-2xl rounded-br-2xl   /* sin TR */

        /* MEDIO */
        sm:rounded-t-none
        sm:rounded-bl-2xl sm:rounded-br-2xl

        /* GRANDE */
        lg:rounded-2xl

        flex flex-col gap-6 w-full bg-green-50 p-4 shadow-sm"
        >
          <h2 className="text-center text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Resumen de Venta
          </h2>

          <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3 border border-green-200">
            <span className="text-sm font-medium text-gray-700">
                Total de venta
            </span>
            <span className="text-xl font-bold text-green-700">
                $ {total}
            </span>
        </div>
          <div className='flex flex-col items-center'>
              <input type='number'  className="input text-center bg-transparent
                appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
                [-moz-appearance:textfield]" 
              
              placeholder='Se paga con:' onChange={(e)=>setChange(e.target.value - total)}>
              </input>
              <span className="font-bold text-green-600">{`Vuelto : $${Math.max(change,0)}`}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-0.5 w-full">
            <button
              className="btn btn-success w-full md:flex-1 min-w-0 truncate"
              disabled={loading}
              onClick={() => handleSaleProcess("paid")}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Procesar Venta"
              )}
            </button>

            <button
              className="btn btn-error w-full sm:flex-1 min-w-0 truncate"
              disabled={loading}
              onClick={() => handleSaleProcess("cancelled")}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Cancelar Venta"
              )}
            </button>

          </div>
        </div>

    
    </>
   

  )
}
