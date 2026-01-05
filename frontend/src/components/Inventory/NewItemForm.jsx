import React from 'react'

import { motion, AnimatePresence } from "framer-motion"
import { SelectUnits } from '../generic/SelectUnits'
import { SelectProviders } from '../generic/SelectProviders'
import { SelectBrands } from '../generic/SelectBrands'
import api from '../../lib/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { Check, X } from "lucide-react"

export const NewItemForm = ({sku}) => {
    
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
            // ...(data?.pricePack !=null && {pricePack:Number(data.pricePack)}) // cambie de opinion, no lo quiero editable desde aqui.
            
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
            <input type='text' name="name" placeholder='Nombre de Producto' className="input input-bordered w-full" required defaultValue={form?.name || ""}></input>
            
            <div className='flex flex-1 gap-1'>
                <input type='number' name="stock"placeholder='Stock' className="input input-bordered appearance-none" required defaultValue={form?.stock || ""}></input>
                <input type='number' name="price" placeholder='Precio Unidad' defaultValue={form?.price || ""} className="input input-bordered appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none
                    [-moz-appearance:textfield]" required>
                        
                </input>
                <input type='number' name="lowStockThreshold"placeholder='¿cuantas son pocas unidades?' defaultValue={form?.lowStockThreshold || ""} className="input input-bordered appearance-none" required></input>
            </div>
            <div className='flex flex-col flex-1  items-stretch justify-center md:flex-row '>
                <label className="flex flex-col flex-1 text-center">
                    Marca
                    <SelectBrands name="brand" defaultValue={form?.brand || ""}></SelectBrands>
                </label>
                <label className="flex flex-col flex-1 text-center">
                    Proveedor
                    <SelectProviders name="provider" defaultValue={form?.provider || ""}></SelectProviders>
                </label>
                {(needsUnits || pricePerUnit) &&     
                    <label className="flex flex-col flex-1 text-center">
                        Unidad de Medida
                        <SelectUnits name="unit" defaultValue={form?.unit || ""}></SelectUnits>
                    </label>
                }
            </div>
            {/** Checkboxes*/}
            <div className='flex flex-col'>
                <div className='flex flex-col justify-center items-center md:flex-row md:justify-around'>
                    <label  className="flex items-center gap-2 cursor-pointer">
                        ¿Se vende por Pack?
                        <input type="checkbox" name="" id=""  onChange={()=>setIsPack(prev=>!prev)} checked={isPack} />
                    </label>
                    <label  className="flex items-center gap-2 cursor-pointer">
                        ¿Requiere unidades de medida?
                        <input type="checkbox" name="" id="" onChange={()=>setNeedsUnits(prev=>!prev)} checked={needsUnits}/>
                    </label>
                    <label  className="flex items-center gap-2 cursor-pointer">
                        ¿Tiene precio/medida?
                        <input type="checkbox" name="" id="" onChange={()=>setPricePerUnit(prev=>!prev)} checked={pricePerUnit}  />
                    </label>
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
                                <input type='text' name="skuPack" placeholder='Codigo de Barra Pack' className="input input-bordered w-full" required defaultValue={form?.skuPack || ""}></input>
                                <input type='number' name="packUnits" placeholder="Cuantas unidades por Pack?" className="input input-bordered appearance-none mx-auto" required defaultValue={form?.packUnits || ""}/>
                                <input type='number' name="packPrice" placeholder="Precio por Pack" className="input input-bordered appearance-none mx-auto " required defaultValue={form?.packPrice || ""}/>
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
                                <input type='number' name="ppu" placeholder='Precio Por Unidad de Medida' className="input input-bordered appearance-none" required defaultValue={form?.ppu || ""}></input>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
            </div>
            <button type='submit' className='btn btn-primary mt-8'>{sku ?"Actualizar Producto":"Ingresar Producto"}</button>
        </form>
  )
}
