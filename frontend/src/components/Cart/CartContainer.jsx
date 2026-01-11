import React from 'react'
import { CartItem } from './CartItem'
import api from "../../lib/axios"
import toast from "react-hot-toast"

export const CartContainer = ({sumTotal}) => {

    const [saleId,setSaleId] = React.useState(null)
    const [items,setItems] = React.useState([])
    const [newSku,setNewSku] = React.useState("");// la idea seria un useEffect donde al scanear se cambie este estado y se vaya a buscar los datos del objeto y se agrege a items

    const handleScanner = ()=>{
        // cambia newSku
        //fuerza useEffect
        // agrega a Items
        // remapea CartItems
    }
    
    React.useEffect( ()=>{
        const createSale= async()=>{
            try{
                const res = await api.post("/cart/")
                setSaleId(res.data._id)
                setItems(res.data.items)
                if (res.status === 201) {
                    toast.success("Nuevo carrito")
                } else {
                    toast.success("Carrito cargado")
                }

            }catch(error){
                console.log("error creando/carando el carrito",error)
            }
        }

        createSale()
    },[])

    const deleteItem = (sku)=>{
        setItems( (prev)=> 
            prev.filter(item =>item.sku !==sku)
        )
    }

    const addItem = async ()=>{

        try {
            if(newSku != ""){
                // validacion más profunda luego, quizá hasta lo hago en el onchange del input y era
                const result = await api.post(`/cart/sales/${saleId}/items/${newSku}`)
                if (result.status === 201) {
                    toast.success("Item Agregado")
                }else {
                    toast.success("Item actualizado")
                }
            }
        } catch (error) {
            console.log("error agregando al carrito",error)
        }
    }


  return (
    <div className='flex flex-col w-10/12 bg-base-100  rounded-tr-4xl '>
        {/**Fila */}
        <div className="overflow-x-auto">
                {items.map((item,i)=>(
                    <div className={i % 2 === 0 ? "bg-base-200/60 rounded-xl shadow-sm m-2" : "bg-base-100 rounded-xl shadow-sm m-2"}>
                        <CartItem data={item} onDelete={deleteItem} />
                        <CartItem data={item} onDelete={deleteItem}/>
                        <CartItem data={item} onDelete={deleteItem}/>
                        <CartItem data={item} onDelete={deleteItem}/>
                        <CartItem data={item} onDelete={deleteItem}/>
                    </div>
                )

                )}

        </div>
        <div className=' w-full flex  justify-end  bg-base-300'>
            <div className=' flex-1 bg-base-200'>

            </div>
            <div className=' flex justify-center w-3/12 bg-base-200 join'>
                <button className='btn  btn-dash ' onClick={addItem}>Insertar Producto</button>
                <input type='text' placeholder='Inserte Codigo de Barra' className="input input-neutral bg-success text-success-content" value={newSku} onChange={(e)=>setNewSku(e.target.value)}/>

            </div>
        </div>

      
    </div>
  )
}
