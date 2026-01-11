import React from 'react'
import { NavBar } from '../components/navbar/NavBar'
import { CartContainer } from '../components/Cart/CartContainer';
import { CartSummary } from '../components/Cart/CartSummary';

export const Cart = () => {
    const [total,setTotal] = React.useState(0)
    const sumTotal = (newTotal)=>{
        setTotal(newTotal)
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
                        <span className="badge badge-sm badge-primary">3</span>
                        </div>
                    </div>

                    <div className="mb-1 col-span-9 col-start-3 md:col-start-10 md:col-span-2 order-2 md:order-1">
                        <CartSummary total={total} />
                    </div>
                </div>


                {/* CARRITO */}
                <div className="w-full flex justify-center rounded-tr-2xl ">
                    <CartContainer sumTotal={sumTotal} />
                </div>
               
                

            </div>
        </main>




    </div>
  )
}
