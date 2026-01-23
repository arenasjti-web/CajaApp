import React from 'react'
import api from '../../lib/axios';

export const SelectProviders = (props) => {

    const [providers,setProviders] = React.useState([]);
    React.useEffect(  ()=>{

      const fetchProviders = async ()=>{
        try{
          
          const res = await api.get("/inventory/provider")
          //console.log("providers desde backend:", res.data)
          setProviders(res.data)
        }catch(error){
          console.error(error)
        }
      }
      fetchProviders()
    },[])


    const handleSelectChange =(e)=>{
      props?.setValue((prev)=>({...prev,provider:e.target.value}))
    }

return (
    <select name="provider" className='select w-full' value={props?.defaultValue} onChange={handleSelectChange}>
        {/** Map providers */}
        <option value="">-- Seleccione un Proveedor --</option>
        { providers.map( (provider) =>(

             <option key={provider._id} value={provider._id}>{provider.name}</option>
          )
          )
          
        }
       
    </select>
  )
}
