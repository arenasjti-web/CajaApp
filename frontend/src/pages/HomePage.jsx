import React from 'react'
import { NavBar } from '../components/navbar/NavBar'
import { RevenueLine } from '../components/dashboard/RevenueLine'
import {Stat} from "../components/dashboard/Stat"
import { Table } from '../components/Inventory/Table'
import api from '../lib/axios'
import { ItemsComboBox } from '../components/generic/ItemsComboBox'
import { RevenueBar } from '../components/dashboard/RevenueBar'
import { SalesTable } from '../components/dashboard/SalesTable'

export const HomePage = () => {
  const [selectedItem, setSelectedItem] = React.useState(null)
  const [monthRange,setMonthRange] = React.useState({})
  const [monthRangeBar,setMonthRangeBar] = React.useState({})
  const [stats,setStats] = React.useState({
          firstStat: null,
          secondStat: null,
          thirdStat: null
      })

  React.useEffect(()=>{
    
    const fetchStats = async()=>{
      const {data} = await api.get(`/dashboard/stats`)

      setStats(data)
    }

    fetchStats()
  },[])

  //console.log("rango:",monthRange) format: yyyy-mm 2026-02'

  return (
  <div className="flex min-h-screen min-w-screen">
    
    <NavBar />

    <main className="flex flex-1 w-full bg-base-200">
      
      {/* CONTENEDOR CENTRAL */}
      <div className="w-full flex flex-col mt-10 gap-4">

        {/* STATS */}
        <div className="flex justify-center">
          <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-10/12">
            <Stat statData={stats.firstStat} />
            <Stat statData={stats.secondStat} />
            <Stat statData={stats.thirdStat} />
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="flex justify-center w-full">
          <div className="flex flex-col md:flex-row gap-2 w-10/12">
            
           <div className="flex flex-col flex-1 bg-base-100 rounded-t-2xl min-h-[350px]">
              <div className="flex gap-2 mx-8 mt-4">
                <input type="month" className="input input-ghost"
                  onChange={(e)=>setMonthRangeBar(p=>({...p,min:e.target.value}))}
                />
                <input type="month" className="input input-ghost"
                  onChange={(e)=>setMonthRangeBar(p=>({...p,max:e.target.value}))}
                />
              </div>
              <RevenueBar filters={{ monthRangeBar }} />
            </div>

            <div className="flex flex-col flex-1 bg-base-100 rounded-t-2xl min-h-[350px]">
              <div className="flex gap-2 mx-8 mt-4">
                <input type="month" className="input input-ghost"
                  onChange={(e)=>setMonthRange(p=>({...p,min:e.target.value}))}
                />
                <input type="month" className="input input-ghost"
                  onChange={(e)=>setMonthRange(p=>({...p,max:e.target.value}))}
                />
                <ItemsComboBox
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              </div>
              <RevenueLine filters={{ monthRange, selectedItem }} />
            </div>

          </div>
        </div>

        {/* TABLA (CRECE HACIA ABAJO SIN ROMPER NADA) */}
        <div className="flex justify-center w-full">
          <div className="w-10/12">
            <SalesTable />
          </div>
        </div>

      </div>
    </main>
  </div>
)

}
