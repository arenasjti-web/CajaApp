import React from 'react'

//https://daisyui.com/components/stat/
export const Stat = ({statData}) => {
  
  return (
    <>
        <div className="stat flex flex-col items-center justify-center shadow-xs shadow-accent-content">

          <div className="
            stat-title
            text-sm sm:text-base lg:text-2xl
            text-center
          ">
            {statData?.statName ?? "Estadística"}
          </div>

          <div className="
            stat-value
            text-4xl sm:text-6xl lg:text-8xl
            leading-none
          ">
            {statData?.stat ?? 0}
          </div>

          <div className="
            stat-desc
            text-[10px] sm:text-xs lg:text-2xs
            text-center
          ">
            {statData?.lastChange
              ? new Date(statData.lastChange.createdAt).toLocaleString("es-CL", {
                  dateStyle: "short",
                  timeStyle: "short",
                })
              : "--"}
          </div>

        </div>

    </>
  )
}
  