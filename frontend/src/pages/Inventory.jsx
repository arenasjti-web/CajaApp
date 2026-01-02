import React from 'react'
import { NavBar } from '../components/navbar/NavBar'
import { StatBlock } from '../components/dashboard/StatBlock'
import { Stat } from '../components/dashboard/Stat'
import { Table } from '../components/Inventory/Table'
import { Card } from '../components/Inventory/Card'
import { Filter } from '../components/Inventory/Filter'

export const Inventory = () => {
    const [filters,setFilters] = React.useState({
            search: "",
            category: "",
    })
  return (
    <div className='flex h-screen'>
        <NavBar></NavBar>
        <main className='flex flex-col flex-1 w-full bg-base-200'>
            <div className='flex flex-col mx-auto mt-8 w-3/4 shadow bg-accent/80 rounded-2xl'>
                <div className='flex justify-end mx-4 mt-2'>
                    <button className="btn btn-primary btn-dash hover:bg-transparent hover:scale-110 hover:text-primary">Agregar Producto +</button>
                </div>
                <div className='stats stats-vertical lg:stats-horizontal shadow  '>
                    <Stat></Stat>
                    <Stat></Stat>
                    <Stat></Stat>
                </div>
            </div>
            <div className='flex flex-col w-7/8 mx-auto mt-8 bg-base-100 rounded-2xl'>
                <Filter initialFilters={filters} onApply={setFilters}></Filter>
                <Table filters={filters}></Table>

            </div>
        </main>
    </div>
  )
}
