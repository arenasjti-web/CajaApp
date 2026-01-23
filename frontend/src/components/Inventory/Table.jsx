import React from 'react'
import api from '../../lib/axios'
import { TableRow } from './TableRow';
import toast from 'react-hot-toast';
import { DeleteConfirmModal } from '../generic/DeleteConfirmModal'
export const Table = ({filters}) => {

    const [data,setData] = React.useState([])
    const [isRateLimited,setIsRateLimited] =React.useState(false);
    const [loading,setLoading] = React.useState(false);
    const [deleteSku, setDeleteSku] = React.useState(null)

    const [totalPages,setTotalPages] = React.useState(2)
    const [total,setTotal] = React.useState(0)
    const [page,setPage] = React.useState(1)
    const [limit,setLimit] = React.useState(20)

    const [pagination,setPagination] = React.useState(null)



    React.useEffect(  ()=>{
        const controller = new AbortController()

        const fetchData = async ()=>{
            try {
                const params = new URLSearchParams({
                    filters: JSON.stringify(filters),
                    pagination: JSON.stringify({
                        page,
                        limit    
                    })
                })  
                const {data} = await api.get(`/inventory?${params}`, {
                    signal: controller.signal
                })
                setData(data.data)
                setPagination(data.pagination)
                setIsRateLimited(false)
            } catch (error) {
                
                // evita que me tire el error por el controller.abort()
                 if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                    console.log("Request abortada (normal)")
                    return
                }

                if(error.response?.status === 429){//rate limited
                    console.log("Error fetching Data ")
                    setIsRateLimited(true);
                }
                else{
                    console.log("Error fetching Data. TOAST! ")
                    toast.error("Failed to fetch Data")
                }
            }
            finally{
                setLoading(false)
            }
        }

        setLoading(true)
        fetchData()
        return () => controller.abort() // que solo la ultima request valida pueda cambiar el estado. sin esto , en caso de 2 o mas request; una request mas lenta y mas vieja podria acabar mostrandose
    },[filters,page,limit])


     const handleDeleteClick = (sku) => {
        setDeleteSku(sku)
    }

  const handleConfirmDelete = async (sku) => {
    await deleteItem(sku)
    setDeleteSku(null)
  }


    const deleteItem = async(sku)=>{
    alert("item se deberia borrar aquí");

    try{
      const res = await api.delete(`/inventory/delete/${sku}`) // no ahcen falta los ":" en el front
      setData(prev =>
        prev.filter(item => item.sku !== sku)
    )
      
    }catch (error) {
        console.error("DELETE ERROR:", error)
        toast.error("No se pudo eliminar el item")
    }

  }

    
  
  return (
    <div className="overflow-x-auto sm:overflow-x-visible  shadow-xl ">
        <table className="table w-full">
            {/* head */}
            <thead className='text-center'>
            <tr>
                
                <th>Sku</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th className="w-auto text-center">action</th>
            </tr>   
            </thead>
            <tbody className='zebra-inverted'>
            {/* row 1 */}
            {data.map((d,i) =>(
                <TableRow key={d.sku} row={d} rowStyle={i % 2 === 0 ? "bg-base-200" : "" } handleDeleteClick={handleDeleteClick}></TableRow>
            )
            )}
            </tbody>
        </table>
            {(pagination && filters)&& (
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
                                setPage(pagination.page - 1)
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
                                    setPage(i + 1)
                                }
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="join-item btn btn-sm"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() =>
                                setPage(pagination.page + 1)
                            }
                        >
                            »
                        </button>

                    </div>
                </div>
            )}
        <DeleteConfirmModal 
            open={!!deleteSku}
            sku={deleteSku}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteSku(null)}>
        </DeleteConfirmModal> 
    </div>
  )
}
