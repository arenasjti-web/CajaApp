import React from 'react'
import { SalesTable } from '../components/dashboard/SalesTable'
import { NavBar } from '../components/navbar/NavBar'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { MoveUp,MoveDown} from 'lucide-react';

export const SaleHistory = () => {

    const [monthRange, setMonthRange] = React.useState(() => {
        const max = new Date()
        const min = new Date()
        min.setMonth(min.getMonth() - 6)

        return { min, max }
    })

    const [dateToggle,setDateToggle] = React.useState(1)//order
    const [priceToggle,setPriceToggle] = React.useState(1)

    const [filters,setFilters] = React.useState({
        min: monthRange.min,
        max: monthRange.max,
        dateOrder: dateToggle,
        priceOrder: priceToggle
    })
   
    const handleFilters = ()=>{
        setFilters({
            min: monthRange.min,
            max: monthRange.max,
            dateOrder: dateToggle,
            priceOrder: priceToggle
        })
    }

    
  const handlePriceToggle= (e)=>{
    //e.preventDefault()
    setPriceToggle(prev => {
        const next = prev * -1
        // setFilters((prev)=>(
        //     {
        //         ...prev,
        //         priceOrder:next
        //     }
        // ))
      return next;
    })
  }
  const handleDateToggle= (e)=>{
    //e.preventDefault()
    setDateToggle(prev => {
      const next = prev * -1
    //   setFilters((prev)=>(
    //     {
    //         ...prev,
    //         dateOrder:next
    //     }
    //   ))
      return next;
    })
  }

  return (
    <div className="flex min-h-screen min-w-screen bg-base-200">
        <NavBar />
        <main className="flex justify-center w-full bg-base-200 mt-14">
            {/* CONTENEDOR MAESTRO */}
            <div className="w-10/12">

                {/* FILTROS */}
                <div className="flex gap-2 justify-end items-center bg-base-100 rounded-t-2xl px-6 py-3">
                    <div className="flex gap-2">
                        <DatePicker
                            selected={monthRange.min}
                            onChange={(date) =>
                            setMonthRange(p => ({ ...p, min: date }))
                            }
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            className="input text-center"
                            portalId="datepicker-portal"
                        />

                        <DatePicker
                            selected={monthRange.max}
                            onChange={(date) =>
                            setMonthRange(p => ({ ...p, max: date }))
                            }
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            className="input text-center"
                            portalId="datepicker-portal"
                        />
                    </div>
                    <div className="flex gap-2">
                        {/**Precio */}
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
                    <div className="flex gap-2">
                        {/**Fecha */}
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

                    <button className="btn" onClick={handleFilters}>
                        Aplicar
                    </button>
                </div>

                {/* TABLA */}
                <SalesTable filters={filters} />
            </div>
        </main>
    </div>

  )
}
