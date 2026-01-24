import React from 'react'

import { motion, AnimatePresence } from "framer-motion"
import { SelectUnits } from '../generic/SelectUnits'
import { SelectProviders } from '../generic/SelectProviders'
import { SelectBrands } from '../generic/SelectBrands'
import api from '../../lib/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { Check, X } from "lucide-react"
import { SelectCategories } from '../generic/SelectCategories'

export const NewItemForm = ({sku,onModal}) => {
    
    const [form, setForm] = React.useState(null)
    const navigate = useNavigate()


    const [isPack,setIsPack] = React.useState(false)
    const [needsUnits,setNeedsUnits] = React.useState(false)//deberia ser solo una de estas posible a la vez
    const [pricePerUnit,setPricePerUnit] = React.useState(false)// no ambas posiblemente
    const inputRef = React.useRef(null)
    const [value, setValue] = React.useState("")

    const [skuPack,setSkuPack] = React.useState("")// deberia tener un useEFFECT que busque el precio del pack si es que ya existe en la BD. deberia dar error si es que no existe
    // deberia tener una funcion que confirme que el codigo de barra del producto existe o no



    React.useEffect(() => {
        
        if (!sku) return
        if(onModal){
            setForm({sku})
            return
        }

        const fetchItem = async () => {
            try {
                const { data } = await api.get(`/inventory/${sku}`)
                setForm(data)
                // derecho desde data. setForm no ocurre hasta luego , incluso finally no lo hace bien
                setPricePerUnit(Boolean(data?.ppu))
                setIsPack(Boolean(data?.skuPack))
                setNeedsUnits(Boolean(data?.unit))
            
            } catch (err) {
                toast.error("Error loading item")
                navigate("/inventory")
            }
            // finally{
            //     if(form?.ppu) setPricePerUnit(true)
            //     if(form?.skuPack) setIsPack(true)
            //     if(form?.unit) setNeedsUnits(true)
            // }
        }

        fetchItem()
    }, [sku])


     const handleSubmit = async (e)=>{
        e.preventDefault();

        const formData = new FormData(e.target) // e.target = <form>
        const data = Object.fromEntries(formData.entries())

        
        try {
            const formatedData = formatData(data)

            if(onModal){ 
                const newItem = await api.post("/inventory",formatedData)
                toast.success("Item created successfully!")
                console.log("data: ",newItem)
                onModal(newItem)
                return
            }

            if(sku){
                const updatedItem = await api.put(`/inventory/${sku}`,formatedData)
                toast.success("Item updated successfully!")
                
            }
            else{
                const newItem = await api.post("/inventory",formatedData)
                toast.success("Item created successfully!")
            }
            navigate("/inventory")

        } catch (error) {
            console.log("Error creating Item",error)
            if(error.response?.status===429){
                toast.error("Slow Down! you are creating items too fast!",{
                duration: 4000,
                icon:"💀"
                })
            }
            else{
                toast.error("Failed to create Item!")
            }
        }
    }

    const formatData= (data)=>{
        const formatedData = {
            sku:data.sku.trim(),
            name:data.name.trim(),
            price: Number(data.price),
            stock:Number(data.stock),
            lowStockThreshold:Number(data.lowStockThreshold),
            brand:data.brand,
            provider:data.provider,
            ...(data?.unit != null && {unit:data.unit}), // Solo agrega el campo si este existe
            ...(data?.ppu !=null && {ppu:Number(data.ppu)}), // !== null daria true a undefined!== null lo que seria un problema , != es lo correcto aqui
            ...(data.skuPack?.trim() && {skuPack:data.skuPack.trim()}),// trim ya devuelve true si hizo su trabajo por lo que no hace falta mas condicion
            ...(data?.packUnits && {pu:data.packUnits})
            
        }

        return formatedData;

    }

    const clearInput = () => {
        setValue("")
        inputRef.current?.focus()
    }


  return (
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <div className="relative w-full">
                <input ref={inputRef} type='text' name="sku" placeholder='Codigo de Barra' className="input input-bordered w-full" required autoFocus
                     onChange={(e) => setValue(e.target.value)} defaultValue={form?.sku || ""}></input>
                
                {value && (
                    <button
                    type="button"
                    onClick={clearInput}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                    <X size={18} />
                    </button>
                )}
            </div>
           <div className="join w-full">
                <input
                    name='name'
                    className="input input-bordered join-item flex-3"
                    placeholder="Nombre del producto"
                />

                <SelectCategories/>
            </div>
            
            <div className='flex flex-1 gap-1'>
                <input type='number' name="stock"placeholder='Stock' className="input input-bordered appearance-none" required defaultValue={form?.stock || ""}></input>
                <input type='number' name="price" placeholder='Precio Unidad' defaultValue={form?.price || ""} className="input input-bordered appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none
                    [-moz-appearance:textfield]" required>
                        
                </input>
                <input type='number' name="lowStockThreshold"placeholder='¿cuantas son pocas unidades?' defaultValue={form?.lowStockThreshold || ""} className="input input-bordered appearance-none" required></input>
            </div>
            <div className='flex flex-col flex-1 gap-1 items-stretch justify-center md:flex-row join'>
                <label className=" label flex flex-col flex-1 text-center">
                    <span className="label-text">Marca</span>
                    <SelectBrands  defaultValue={form?.brand || ""} setValue={setForm}></SelectBrands>
                </label>
               <label className=" label flex flex-col flex-1 text-center">
                    <span className="label-text">Proveedor</span>
                    <SelectProviders defaultValue={form?.provider || ""} setValue={setForm}></SelectProviders>
                </label>
                
            </div>
            {/** Checkboxes*/}
            <div className='flex flex-col'>
                <div className='flex flex-col justify-center items-center md:flex-row gap-1'>
                    <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                        <legend className="fieldset-legend ">¿Es un Pack?</legend>
                        <label className="label">
                            <input type="checkbox"  className="toggle" onChange={()=>setIsPack(prev=>!prev)} checked={isPack}/>
                            ej: pack cerveza
                        </label>
                    </fieldset>
                     <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                        <legend className="fieldset-legend">¿Tiene precio/medida?</legend>
                        <label className="label">
                            <input type="checkbox"  className="toggle" onChange={()=>setPricePerUnit(prev=>!prev)} checked={pricePerUnit}  />
                           ej: se vende por kg
                        </label>
                    </fieldset>
                </div>
                <div className='flex flex-col flex-1 gap-2 justify-center mt-4 '>
                    {/* */}
                    <AnimatePresence>
                        {isPack &&
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="flex flex-1 gap-2"
                            >
                                <div className='flex justify-center items-center w-full'>
                                    <div className='flex w-full mx-10'>
                                        <input type='text' name="skuPack" placeholder='Codigo de Barra Unidad' className="input input-bordered flex-3" required defaultValue={form?.skuPack || ""}></input>
                                        <input type='number' name="packUnits" placeholder="unidades?" className="input input-bordered appearance-none flex-1" required defaultValue={form?.packUnits || ""}/>

                                    </div>

                                </div>
                            </motion.div>
                        }
                    </AnimatePresence>
                    {/* */}
                    <AnimatePresence>
                        {pricePerUnit && 
                        
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="flex flex-1 gap-2 items-center justify-center"
                            >
                                <div className='flex items-center justify-center w-full'>
                                    <input type='number' name="ppu" placeholder='Precio Por Unidad de Medida' className="input input-bordered appearance-none " required defaultValue={form?.ppu || ""}></input>
                                    <div>
                                        <SelectUnits></SelectUnits>
                                    </div>
                                </div>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
            </div>
            <button type='submit' className='btn btn-primary mt-8'>{(sku && !onModal) ?"Actualizar Producto":"Ingresar Producto"}</button>
        </form>
  )
}
