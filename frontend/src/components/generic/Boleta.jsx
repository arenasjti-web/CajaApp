import React from 'react'

export const Boleta = ({saleData}) => {

    const total = saleData?.items.reduce(
        (acc, item) => acc + item.quantity * item.priceAtSale,
        0
    )

  return (
     <div className="flex justify-center w-full ">
        <div className="w-full max-w-sm bg-base-100 rounded-2xl shadow-lg px-6 py-5">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-lg font-bold">Boleta</h1>
                    <span className="text-sm opacity-60">#{saleData?._id.slice(-6)}</span>
                </div>

                <div className="text-right text-sm">
                    <div className="opacity-80">
                        {saleData?.updatedAt &&
                            new Date(saleData.updatedAt).toLocaleString("es-CL", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                        }
                    </div>
                    <span className="badge badge-success badge-sm mt-1">
                         Pagado
                    </span>
                </div>
            </div>

            <div className="divider my-3" />

                {/* INFO GENERAL */}
                <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                        <span className="opacity-60">{saleData?.createdBy.username}</span>
                        <span></span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-60">Cliente</span>
                        <span>—</span>
                    </div>
                </div>

            <div className="divider my-3" />

                {/* ITEMS */}
                <div className="flex flex-col gap-3">
                    {saleData?.items.map( (item)=>(
                        <div className="flex justify-between text-sm">
                            <div className="flex flex-col">
                                <span className="font-medium">{item.nameSnapshot}</span>
                                <span className="text-xs opacity-60">{item.quantity} × {item.priceAtSale}</span>
                            </div>
                            <span className="font-mono">{item?.quantity  * item?.priceAtSale}</span>
                        </div>
                    ))}

                    
                </div>

                <div className="divider my-3" />

                {/* TOTALES */}
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="opacity-60">Subtotal</span>
                        <span>${total}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-60">Impuesto</span>
                        <span>$0</span>
                    </div>
                </div>

                <div className="flex justify-between text-lg font-bold mt-3">
                    <span>Total</span>
                    <span>${total}</span>
                </div>

                <div className="divider my-3" />

            {/* FOOTER */}
            <div className="text-center text-xs opacity-50">
            Documento no tributario
            </div>

        </div>
</div>
  )
}
