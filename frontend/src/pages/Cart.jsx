import React from 'react'
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { NavBar } from '../components/navbar/NavBar'
import { CartContainer } from '../components/Cart/CartContainer';
import { CartSummary } from '../components/Cart/CartSummary';


export const Cart = () => {
    const [total,setTotal] = React.useState(0)
    const [itemCount,setItemCount] = React.useState(0)
    const [saleId,setSaleId] = React.useState(null)
    const [items,setItems] = React.useState([])

    

    // Cargar/Crear venta

    const createSale= async()=>{
        try{
            const res = await api.post("/cart/")
                setSaleId(res.data._id)

            if (res.status === 201) {      
                toast.success("Carrito cargado")
            } else {
                setItems(res.data.items)
                setTotal(res.data.totalAmount ?? 0)
                toast.success("Nuevo carrito")
                
            }

        }catch(error){
            console.log("error creando/carando el carrito",error)
        }
    }
    React.useEffect( ()=>{
        createSale()
    },[])

    // Procesar Venta

    const processSale = async(status)=>{
        try {
            const res = await api.put(`/cart/sales/${saleId}`,{status,total})
            if(res.status===200){
                status==="paid"?toast.success("Venta Procesada"):toast.success("Venta Cancelada")
                // 
                resetStates()
                await createSale()
            }
        } catch (error) {
            console.log("error procesando la compra",error)
        }
    }


    const resetStates= ()=>{
        setItems([])
        setTotal(0)
        setItemCount(0)
        setSaleId(null)
    }

    // recalcula suma total
    React.useEffect(()=>{
        if( !items || items.length=== 0) return

        sumTotal()

    },[items])

 
    function changeQuantity(sku,delta){
        
         setItems( (prev)=> prev.map(item =>
                item.sku === sku
                ? { ...item,  quantity: Math.max(0, item.quantity + delta) }
                : item
            )
        )
    }

    const deleteItem = async(sku)=>{
        
        const product = items.find(item => item.sku === sku)
        const itemId = product?.itemId
        try {
            const res = await api.delete(`/cart/sales/${saleId}/items/${itemId}`)
            setItems( (prev)=> 
                prev.filter(item =>item.sku !==sku)
            )
        } catch (error) {
            console.log("Item could not be deleted, try again!",error)
        }
    }

    const sumTotal = ()=>{
        var total = 0
        var count = 0
        items.forEach(item=>{
            count+= item.quantity
            total+= ( item.priceAtSale * item.quantity)
        })
        setTotal(total)
        setItemCount(count)
    }




  return (
    <div className='flex min-h-screen min-w-screen' >
        <NavBar></NavBar>
        <main className="flex flex-1 w-full bg-base-200  ">
        {/* CONTENEDOR CENTRADO */}
            <div className="w-full  flex flex-col mt-10">
                
                {/* FILA DEL RESUMEN */}
                <div className="w-full grid grid-cols-12">
                    <div className=" col-start-9 col-span-3  md:col-start-10 md:col-span-2 lg:col-start-2 lg:col-span-1 self-end bg-base-100 text-center rounded-t-2xl order-1">
                        <div className="flex justify-center gap-1 my-1">
                        <span className="font-semibold">Carrito</span>
                        <span className="badge badge-sm badge-primary">{itemCount}</span>
                        </div>
                    </div>

                    <div className="mb-1 col-span-9 col-start-3 md:col-start-10 md:col-span-2 order-2 md:order-1">
                        <CartSummary total={total} processSale={processSale} />
                    </div>
                </div>


                {/* CARRITO */}
                <div className="w-full flex justify-center rounded-tr-2xl ">
                    <CartContainer saleId={saleId} items={items} setItems={setItems} sumTotal={sumTotal}  onQuantityChange={changeQuantity} deleteItem={deleteItem}/>
                </div>
               
                

            </div>
        </main>




    </div>
  )
}
