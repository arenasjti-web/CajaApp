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

      if(props?.setDraft != undefined){
        props.setDraft( d =>({...d,provider:e.target.value}))
      }
    }

return (
    <select className='select  ' onChange={handleSelectChange} value={props.value ?? ""}>
        {/** Map providers */}
        <option value="">-- Seleccione un Proveedor --</option>
        { providers.map( (provider) =>(

             <option key={provider.name} value={provider.name}>{provider.name}</option>
          )
          )
          
        }
       
    </select>
  )
}
