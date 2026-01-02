import React from 'react'
import { Dropdown } from '../generic/Dropdown'
import api from '../../lib/axios'

export const TableRow = ({row,rowStyle,onDelete, handleDeleteClick}) => {
 
  return (
    <>
    <tr className={`text-center ${rowStyle}`}>
        {/** Crear los td segun el contenido de row */}
        <td>{row.sku}</td>
        <td>{row.name}</td>
        <td>{row.price}</td>
        <td>{row.stock}</td>
        <td>{<Dropdown sku={row.sku} onDelete={handleDeleteClick}></Dropdown>}</td>
    </tr>
   
    </>
  )
}
