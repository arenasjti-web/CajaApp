import React from 'react'
import { Stat } from './Stat'

export const StatBlock = () => {
    // hacer queries para las 3 stadisticas
    const [stats,setStats] = React.useState([])
  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow
                    h-1/4 mx-10 mt-6 bg-accent
    ">
        <Stat ></Stat>
        <Stat ></Stat>
        <Stat ></Stat>
    </div>
  )
}
