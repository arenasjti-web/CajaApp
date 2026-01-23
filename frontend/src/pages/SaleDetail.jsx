import React from 'react'
import api from '../lib/axios'
import { useParams } from 'react-router'
import { NavBar } from '../components/navbar/NavBar'
import { Boleta } from '../components/generic/Boleta'

export const SaleDetail = () => {

    const [sale,setSale] = React.useState()
    const {saleId} = useParams() 
    React.useEffect(()=>{
        const fetchSale = async()=>{
            try {
                //const params = {saleId}
                const {data} = await api.get(`/dashboard/sale/${saleId}`)
                setSale(data)
            } catch (error) {
                console.log("Error fetching saleData")
            }
        }
        fetchSale()
    },[])

  return (
    <div className="flex min-h-screen min-w-screen bg-base-200">
        <NavBar></NavBar>
        <main className="my-auto w-full bg-base-200">
            <Boleta saleData={sale}></Boleta>
        </main>
    </div>

  )
}
