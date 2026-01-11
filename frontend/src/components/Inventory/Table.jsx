import React from 'react'
import api from '../../lib/axios'
import { TableRow } from './TableRow';
import toast from 'react-hot-toast';
import { DeleteConfirmModal } from '../generic/DeleteConfirmModal'
export const Table = ({filters}) => {

    const [data,setData] = React.useState([{sku:"3123",name:"",price:"",stock:""},{sku:"3122",name:"",price:"",stock:""}])
    const [isRateLimited,setIsRateLimited] =React.useState(false);
    const [loading,setLoading] = React.useState(false);
     const [deleteSku, setDeleteSku] = React.useState(null)

    React.useEffect(  ()=>{
        const controller = new AbortController()

        const fetchData = async ()=>{
            try {
                const params = new URLSearchParams({
                    filters: JSON.stringify(filters)
                })
                const res = await api.get(`/inventory?${params}`, {
                    signal: controller.signal
                })
                setData(res.data)
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
    },[filters])


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
                <th className="w-auto text-center">...</th>
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
        <DeleteConfirmModal 
            open={!!deleteSku}
            sku={deleteSku}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteSku(null)}>
        </DeleteConfirmModal> 
    </div>
  )
}
