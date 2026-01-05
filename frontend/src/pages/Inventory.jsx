import React from 'react'
import { NavBar } from '../components/navbar/NavBar'
import { StatBlock } from '../components/dashboard/StatBlock'
import { Stat } from '../components/dashboard/Stat'
import { Table } from '../components/Inventory/Table'
import { Card } from '../components/Inventory/Card'
import { Filter } from '../components/Inventory/Filter'
import { Link, useNavigate } from 'react-router'
import api from '../lib/axios'

export const Inventory = () => {

    const [filters,setFilters] = React.useState({
            search: "",
            category: "",
    })

    const [stats,setStats] = React.useState({
        firstStat: null,
        secondStat: null,
        thirdStat: null
    })

    React.useEffect(()=>{
        const fetchStats = async()=>{
            try {
                const {data} = await api.get("/inventory/stats")
                setStats(data)
            } catch (error) {
            console.error("Eror fetching stats:", error)
            }
        }
        fetchStats()
    },[])


  return (
    <div className='flex h-screen'>
        <NavBar></NavBar>
        <main className='flex flex-col flex-1 w-full bg-base-200'>
            <div className='flex flex-col mx-auto mt-8 w-3/4 shadow bg-accent/80 rounded-2xl'>
                <div className='flex justify-end mx-4 mt-2'>
                    <Link to={`/item`} >
                        <button className="btn btn-primary btn-dash hover:bg-transparent hover:scale-110 hover:text-primary" >Agregar Producto +</button>
                    </Link>
                </div>
                <div className='stats stats-vertical lg:stats-horizontal shadow  '>
                    <Stat statData={stats.firstStat} ></Stat>
                    <Stat statData={stats.secondStat}></Stat>
                    <Stat statData={stats.thirdStat}></Stat>
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
