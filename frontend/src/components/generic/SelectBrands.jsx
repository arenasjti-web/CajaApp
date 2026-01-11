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

      if(props?.setDraft != undefined){
        props.setDraft( d =>({...d,brand:e.target.value}))
      }
    }
  return (
    <select className='select' onChange={handleSelectChange} value={props.value ?? ""}>
        {/** Map providers */}
        <option value="">-- Seleccione una Marca</option>
        { brands.map( (brand) =>(

             <option key={brand.name} value={brand.name}>{brand.name}</option>
          )
          )
          
        }
       
    </select>
  )
}
