import React from 'react'
import { SelectProviders } from '../generic/SelectProviders'
import { SelectBrands } from '../generic/SelectBrands'
import { MoveUp,MoveDown} from 'lucide-react';
export const Filter = ({initialFilters,onApply}) => {

  const [draft,setDraft] = React.useState(initialFilters)

  const [priceToggle,setPriceToggle] = React.useState(1)// Mongodb = ASC
  const [dateToggle,setDateToggle] = React.useState(1)
  const [stockToggle,setStockToggle] = React.useState(0)

  const stockToggleValues= ["En Stock","Bajo en Stock","Sin Stock"]

  const handleApply= ()=>{
    onApply(draft)
  }

  const handlePriceToggle= (e)=>{
    //e.preventDefault()
    setPriceToggle(prev => {
      const next = prev * -1
      setDraft(d=>({...d,price:next}))// al parecer cuando hago algo como prev=> o en este caso d=> se usa la ultima version/actualizacion de ese estado, 
      // usar ...draft usaria la version que existia cuando recien se llamó la función
      return next;
    })
  }

   const handleDateToggle= (e)=>{
    //e.preventDefault()
    setDateToggle(prev => {
      const next = prev * -1
      setDraft(d=>({...d,date:next}))
      return next;
    })
  }

  const handleStockToggle= (e)=>{
    //e.preventDefault()
    setStockToggle(prev => {
      const next = (prev + 1) % stockToggleValues.length
      setDraft(d=>({...d,stock:stockToggleValues[next]}))
      return next;
    })
  }

  const cleanFilters =()=>{
    setDraft({
            search: "",
            provider: "",
            brand:"",
            price:1,
            date:1,
            stock:"En Stock"
    })

    setPriceToggle(1)
    setDateToggle(1)
    setStockToggle(0)
  }
 
  return (
    <div className="flex flex-wrap justify-end items-center gap-2 my-1 mr-8 px-2">
        <div className="flex gap-2">
            <input type="text" name = "search" placeholder="Buscar..." className="input input-md " value={draft.search}
              onChange={ e => setDraft({...draft,search: e.target.value})} />
           <SelectProviders setValue={setDraft} value={draft.provider}></SelectProviders>
           <SelectBrands setValue={setDraft} value={draft.brand}></SelectBrands>
        </div>

        {/* Precio */}
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-xs md:text-sm">Precio</span>
          <button
            className="btn btn-ghost btn-xs px-1"
            onClick={handlePriceToggle}
          >
            {priceToggle === 1
              ? <MoveUp className="w-4 h-4" />
              : <MoveDown className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-xs md:text-sm">Fecha</span>
          <button
            className="btn btn-ghost btn-xs px-1"
            onClick={handleDateToggle}
          >
            {dateToggle === 1
              ? <MoveUp className="w-4 h-4" />
              : <MoveDown className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-xs md:text-sm">Stock</span>
          <button
            className="btn btn-ghost btn-xs px-2"
            onClick={handleStockToggle}
          >
            {stockToggleValues[stockToggle]}
          </button>
        </div>

       <div className="flex gap-2 items-center">
  <button
    className="
      btn btn-sm h-8 min-h-8
      btn-success
      text-info-content
      hover:bg-info/90
    "
    onClick={handleApply}
  >
    Aplicar
  </button>

  <button
    className="
      btn btn-sm h-8 min-h-8
      btn-error
      text-warning-content
      hover:bg-warning/90
    "
    onClick={cleanFilters}
  >
    Limpiar
  </button>
</div>

  </div>
  )
}
