import React from 'react'

//https://daisyui.com/components/stat/
export const Stat = ({statData}) => {
  console.log(statData)
  return (
    <>
         <div className="stat flex flex-col items-center justify-center shadow-xs shadow-accent-content">
            <div className="stat-title text-2xl">{statData?.statName ?? "Estadística"}</div>
            <div className="stat-value text-8xl ">{statData?.stat ?? 0}</div>
            <div className="stat-desc text-2xs">{statData?.lastChange ? 
            
              new Date(statData.lastChange.createdAt).toLocaleString("es-CL", {
                dateStyle: "short",
                timeStyle: "short"
              })
               : '--'}</div>
        </div>
    </>
  )
}
  