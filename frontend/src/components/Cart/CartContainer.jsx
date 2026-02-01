import React from 'react'
import { CartItem } from './CartItem'
import api from "../../lib/axios"
import toast from "react-hot-toast"
import { useScanner } from '../../scanner/ScannerContext'
import { NewItemForm } from '../Inventory/NewItemForm'


export const CartContainer = ({items,setItems,saleId,deleteItem,onQuantityChange}) => {

    
    const [newSku,setNewSku] = React.useState("");// la idea seria un useEffect donde al scanear se cambie este estado y se vaya a buscar los datos del objeto y se agrege a items
    const { scan } = useScanner()
    const [missingSku,setMissingSku] = React.useState(null)
    const [showModalMissingSku,setShowModalMissingSku] = React.useState(false)

    React.useEffect(() => {
           if (!scan) return
            const handleScan = async()=>{
                console.log("Código escaneado:", scan)
                await addItem(scan)
            }
            handleScan()
           // aquí haces tu lógica real
       }, [scan])
   

    const addItem = async (sku) => {
        try {
            if (!sku || !saleId) return

            const result = await api.post(`/cart/sales/${saleId}/items/${sku}`)
            
            if (result.status === 201) {
                toast.success("Item Agregado")
                //Aquí
                 setItems((prev)=>([...prev,result.data]))
            }else {
                toast.success("Item actualizado")
                onQuantityChange(sku, 1)
            }

            setNewSku("") // solo limpia el input visual
        } catch (error) {
            if(error.response?.status === 404){
                setMissingSku(sku)
                setShowModalMissingSku(true)
                return
            }
            else{
                console.log("error agregando al carrito", error)
            }
        }
        }


    const handleModal = async({data})=>{
      
        console.log(data) 
        // recibo el nuevo objeto en caso de haberse creado
        if(data){
            const formatedData = {
                itemId:data._id,
                sku:data.sku,
                nameSnapshot:data.name,
                priceAtSale:data.price,
                quantity:1
            }
           
            setShowModalMissingSku(false)
            setMissingSku(null)
            setItems((prev)=>([...prev,formatedData]))
            await addItem(data.sku)
        }
    }

    const onCancelModal = ()=>{
        setMissingSku(null)
        setShowModalMissingSku(false)
    }    

    


  return (
    <div className='flex flex-col w-10/12 bg-base-100  rounded-tr-4xl '>
        {/**Fila */}
        <div className="overflow-x-auto w-full">
            {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-base-content/60">
                <span className="text-lg font-semibold">El carrito está vacío</span>
                <span className="text-sm">Agrega productos para continuar</span>
            </div>
            ) : (
                items.map((item, i) => (
                <div
                    key={item?.id ?? i}
                    className={
                    i % 2 === 0
                        ? "bg-base-200/60 rounded-xl shadow-sm m-2 "
                        : "bg-base-100 rounded-xl shadow-sm m-2 "
                    }
                >
                    <CartItem data={item} saleId={saleId} onDelete={deleteItem} onQuantityChange={onQuantityChange} setItems={setItems} />
                </div>
                ))
            )}

        </div>
        <div className=' w-full flex  justify-end  bg-base-300'>
            <div className=' flex-1 bg-base-200'>

            </div>
            <div className=' flex justify-center w-3/12 bg-base-200 join'>
                <button className='btn  btn-dash ' onClick={()=>addItem(newSku)}>Insertar Producto</button>
                <input type='text' placeholder='Inserte Codigo de Barra' className="input input-neutral bg-success text-success-content" value={newSku} onChange={(e)=>setNewSku(e.target.value)}/>

            </div>
        </div>

        {showModalMissingSku && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                <div className="relative bg-base-100 p-6 rounded-lg w-full max-w-md">

                    {/* Botón cerrar colgado */}
                    <button
                        type="button"
                        className="
                            absolute top-0 right-0
                            w-8 h-8
                            hover:size-10
                            rounded-full
                            bg-red-500
                            text-white
                            flex items-center justify-center
                            hover:bg-red-600
                            transition
                            translate-x-1/2 -translate-y-1/2
                            hover:text-2xl
                        "
                        onClick={onCancelModal}
                        >
                    ✕
                    </button>

                    <NewItemForm
                        sku={missingSku}
                        onModal={handleModal}
                    />

                </div>
            </div>


        )}

      
    </div>
  )
}
