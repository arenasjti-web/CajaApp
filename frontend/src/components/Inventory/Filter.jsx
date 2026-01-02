import React from 'react'

export const Filter = ({initialFilters,onApply}) => {

  const [draft,setDraft] = React.useState(initialFilters)

  const handleApply= ()=>{
    onApply(draft)
  }

  return (
    <>
        <div className="flex justify-end items-center gap-2 my-1 mr-8 ">
            <input type="text" name = "search"placeholder="Buscar..." className="input input-sm" 
              onChange={ e => setDraft({...draft,search: e.target.value})}
            />
            <select name="category" className="select select-sm "
              onChange={e =>setDraft({...draft,category:e.target.value}) }
            >
              <option>Todos</option>
              <option>Descargados</option>
            </select>
            <button className="btn btn-xs sm:btn-sm md:btn-md "
             onClick={handleApply}>Aplicar</button>
        </div>
    </>
  )
}
