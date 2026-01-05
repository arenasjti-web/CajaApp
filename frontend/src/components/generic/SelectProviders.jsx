import React from 'react'
import api from '../../lib/axios';

export const SelectProviders = () => {

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

return (
    <select className='select mx-auto'>
        {/** Map providers */}
        <option value="">-- Seleccione una Opción</option>
        { providers.map( (provider) =>(

             <option key={provider.name} value={provider.name}>{provider.name}</option>
          )
          )
          
        }
       
    </select>
  )
}
