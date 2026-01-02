import React from 'react'
import { Home,ShoppingCart,ChevronsRight,ChevronsLeft,PackageSearch,Store,Cog} from "lucide-react"
import { NavItem } from './NavItem'
import { NavBarTitle } from './NavBarTitle'


export const NavBar = () => {

  const [open, setOpen] = React.useState(false)

  return (
    <div className="drawer drawer-open h-screen w-fit bg-base-200">
        
        <input id="my-drawer-1" type="checkbox" className="drawer-toggle" onChange={() => setOpen(!open)} />
        <div className="drawer-content flex flex-col w-2 my-2 ">
            {/* Page content here */}
            
            <label htmlFor="my-drawer-1" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <ChevronsRight
                    className={`
                        size-8
                        transition-transform
                        duration-400
                        ease-in-out
                        ${open ? "rotate-180" : ""}
                    `}
                />   
            </label>
             
        </div>
        <div className="drawer-side justify-items-center translate-x-0 h-full ">
            <div
                className={`
                    bg-primary/70
                    rounded-r-4xl
                    border-base-300/40
                    
                    h-full
                    flex flex-col
                    overflow-hidden
                    transition-[width]
                    duration-300
                    ease-in-out
                    ${open ? "w-36" : "w-16"}
                `}
            >

                <NavBarTitle isOpen={open}></NavBarTitle>
                <h2 className='text-center font-medium'>Menu</h2>
                <ul className="flex flex-col h-full 
                    items-center
                    is-drawer-close:justify-center
                    is-drawer-open:justify-start
                    is-drawer-open:w-36is-drawer-close:w-16">
                    {/* Sidebar content here */}
                    <NavItem Icon={Home} to='/'></NavItem>
                    <NavItem Icon={ShoppingCart} to='/'></NavItem>
                    <NavItem Icon={PackageSearch} to='/inventory'/>

                    <li className="flex mt-auto mb-5 gap-1 items-center">
                      <Cog className='size-8 '/>
                      <span className='is-drawer-close:hidden'>Config</span>
                    </li>
                </ul>

            </div>
                <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>


        </div>
    </div>
  )
}   
