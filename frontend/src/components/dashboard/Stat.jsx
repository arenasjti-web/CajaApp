import React from 'react'

//https://daisyui.com/components/stat/
export const Stat = (props) => {
  return (
    <>
         <div className="stat flex flex-col items-center justify-center shadow-xs shadow-accent-content">
            <div className="stat-title text-2xl">Downloads</div>
            <div className="stat-value text-8xl ">31K</div>
            <div className="stat-desc text-2xs">Jan 1st - Feb 1st</div>
        </div>
    </>
  )
}
