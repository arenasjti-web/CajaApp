import React from 'react'
import api from '../../lib/axios'
import { User } from 'lucide-react'
import { Link } from 'react-router'

export const SalesTable = (props) => {

    const [sales,setSales] = React.useState([])
    const [totalPages,setTotalPages] = React.useState(2)
    const [total,setTotal] = React.useState(0)
    const [page,setPage] = React.useState(1)
    const [limit,setLimit] = React.useState(20)

    const [pagination,setPagination] = React.useState(null)

    React.useEffect(()=>{
        const fetchTodaysSales = async()=>{
           try {
                //const {min,max,dateOrder,priceOrder} = props ?? {} // asi no revienta. quedaria todo undefined si no existe props
                const params = {
                    min: props?.filters?.min ?? null,
                    max: props?.filters?.max ?? null,
                    dateOrder: props?.filters?.dateOrder ?? null,
                    priceOrder: props?.filters?.priceOrder ?? null,
                    pagination: page ?? 1,
                    limit: limit ?? 10
                }


                const {data} = await api.get(`/dashboard/sales`,{params})
                setSales(data.data)
                setPagination(data.pagination)
           } catch (error) {
                console.log("Error fetching sales",error)
           }
        }

        fetchTodaysSales()
    },[props?.filters,page,limit])

  return (
   <div className="card bg-base-100 shadow-md">
        <div className="card-body p-0">
            
            {!props?.filters &&
                <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                    <h2 className="text-lg font-semibold">Ventas recientes</h2>
                    <Link to={`/sales`}>
                        <button className="btn btn-sm btn-primary">Ver Todas</button>
                    </Link>
                </div>
            }

            
            <div className="overflow-x-auto max-h-[60vh]">
                <table className="table table-zebra table-sm table-pin-rows">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Hecha Por</th>
                            <th>Fecha</th>
                            <th className="text-right">Total</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sales.length === 0 && (
                            <tr>
                                <td colSpan={6}>
                                <div className="flex flex-col items-center justify-center py-8 text-base-content/60">
                                    <span className="text-sm font-semibold">
                                    No hay ventas registradas hoy
                                    </span>
                                    <span className="text-xs mt-1">
                                    Las ventas aparecerán aquí cuando se realicen
                                    </span>
                                </div>
                                </td>
                            </tr>
                        )}

                        {sales.length>0 && sales.map(sale=>(
                            <tr>
                                <td>
                                   {sale._id.toString().slice(-6)} 
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="avatar">
                                            <div className="w-8 rounded-full">
                                                <User></User>
                                            </div>
                                        </div>
                                        <span>{sale.createdBy}</span>
                                    </div>
                                </td>
                                <td>
                                    {sale.updatedAt}
                                </td>
                                <td className="text-right font-mono">
                                    {sale.totalAmount}
                                </td>
                            
                                <td>
                                    <span className="badge badge-success badge-sm font-semibold px-3">
                                        Pagado
                                    </span>
                                </td>
                                <td className="text-center">
                                    <Link to={`/sales/${sale._id}`}>
                                        <button className="btn btn-ghost btn-xs">Ver</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
           {/* PAGINACIÓN */}
           {(pagination && props?.filters)&& (
                <div className="flex items-center justify-between px-6 py-3 border-t border-base-300 text-sm">

                    {/* info */}
                    <span className="text-base-content/60">
                        Mostrando {(pagination.page - 1) * pagination.limit + 1}
                        –
                        {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total
                        )}
                        {" "}de {pagination.total}
                    </span>

                    {/* controles */}
                    <div className="join">

                        <button
                            className="join-item btn btn-sm"
                            disabled={pagination.page === 1}
                            onClick={() =>
                                props.setPage(pagination.page - 1)
                            }
                        >
                            «
                        </button>

                        {Array.from({ length: pagination.totalPages }).map((_, i) => (
                            <button
                                key={i}
                                className={`join-item btn btn-sm ${
                                    pagination.page === i + 1
                                        ? "btn-active"
                                        : ""
                                }`}
                                onClick={() =>
                                    props.setPage(i + 1)
                                }
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="join-item btn btn-sm"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() =>
                                props.setPage(pagination.page + 1)
                            }
                        >
                            »
                        </button>

                    </div>
                </div>
            )}




        </div>
    </div>

  )
}
