import React from 'react'
import api from '../../lib/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

export const BrandProviderForm = () => {

    const [providerCheck,setProviderCheck] = React.useState(false)
    const [brandCheck,setBrandCheck] = React.useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const formData = new FormData(e.target) // e.target = <form>
        const {name} = Object.fromEntries(formData.entries())

        const formatedData = formatData(name)
        try {
            const res = await api.post("/inventory/brandProvider",formatedData)
            toast.success("Marca/Proveedor Creado!!!")
            navigate("/inventory")
        } catch (error) {
            console.log("Error creating Brand/Provider",error)

             if(error.response?.status===409){
                 toast.error("Marca/Proveedor Ya Existe!!",{
                     duration: 4000,
                 })
             }
            if(error.response?.status===429){
                toast.error("Slow Down! you are creating items too fast!",{
                duration: 4000,
                icon:"💀"
                })
            }
            else{
                toast.error("Error Creando Marca/Proveedor!")
            }
        }

    }

    const formatData=(name)=>{

        const formatedData = {
            name: name.trim(),
            isProvider: providerCheck,
            isBrand : brandCheck
        }
        return formatedData
    }
    
  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input type='text' name="name" placeholder='Nombre' className="input input-bordered w-full" required></input>
        <div className='flex justify-center gap-10'>
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                <legend className="fieldset-legend">Es Marca</legend>
                <label className="label">
                    <input type="checkbox"  className="toggle" onClick={()=>setBrandCheck(prev =>!prev)} />
                    Marca al menos uno
                </label>
            </fieldset>
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                <legend className="fieldset-legend">Es Proveedor</legend>
                <label className="label">
                    <input type="checkbox"  className="toggle" onClick={()=>setProviderCheck(prev =>!prev)}/>
                    Marca al menos uno
                </label>
            </fieldset>
        </div>
        <button type='submit' className='btn btn-primary' disabled={!(providerCheck || brandCheck)}>Ingresar</button>
    </form>
  )
}
