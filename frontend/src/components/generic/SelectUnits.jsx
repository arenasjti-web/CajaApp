import React from 'react'

export const SelectUnits = () => {
  return (
    <select className='select mx-auto'>
        <option value="mg">mg</option>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="cc">cc</option>
        <option value="ml">ml</option>
        <option value="l">l</option>
    </select>
  )
}
