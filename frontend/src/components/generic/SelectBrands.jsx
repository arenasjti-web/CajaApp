import React from 'react'
import api from '../../lib/axios'

export const SelectBrands = () => {
    const [brands,setBrands] = React.useState([])

    React.useEffect(  ()=>{

      const fetchBrands = async ()=>{
        try{
          const res = await api.get("/inventory/brand")
          //console.log("brands desde backend:", res.data)
          setBrands(res.data)
        }catch(error){
          console.error(error)
        }
      }
      fetchBrands()
    },[])

  return (
    <select className='select mx-auto'>
        {/** Map providers */}
        <option value="">-- Seleccione una Opción</option>
        { brands.map( (brand) =>(

             <option key={brand.name} value={brand.name}>{brand.name}</option>
          )
          )
          
        }
       
    </select>
  )
}
