import React from 'react'
import api from '../../lib/axios'

export const SelectBrands = (props) => {
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

    const handleSelectChange =(e)=>{
      props?.setValue((prev)=>({...prev,brand:e.target.value}))
    }
  return (
   <select
    name="brand"
    className="select select-bordered w-full"
    value={props?.defaultValue}
    onChange={handleSelectChange}
>
    <option value="">
        --Seleccione una Marca--
    </option>

    {brands.map(brand => (
        <option key={brand._id} value={brand._id}>
            {brand.name}
        </option>
    ))}
</select>

  )
} 
