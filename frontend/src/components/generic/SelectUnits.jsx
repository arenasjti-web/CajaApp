import React from 'react'

export const SelectUnits = (props) => {

  const handleSelectChange =(e)=>{
      props?.setValue((prev)=>({...prev,unit:e.target.value}))
  }

  return (
    <select name="unit" className="select flex-1 min-w-0 " value={props?.defaultValue} onChange={handleSelectChange}>
        <option value="">--Unidad--</option>
        <option value="mg">mg</option>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="cc">cc</option>
        <option value="ml">ml</option>
        <option value="l">l</option>
    </select>
  )
}
