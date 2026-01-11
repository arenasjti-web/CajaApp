import React from 'react'
import { Home,ShoppingCart,ChevronsRight,ChevronsLeft,PackageSearch,Store,Cog} from "lucide-react"
import { NavItem } from './NavItem'
import { NavBarTitle } from './NavBarTitle'


export const NavBar = () => {

  const [open, setOpen] = React.useState(false)

  return (
    // sticky mas adelante
  <aside className="sticky top-0 h-screen shrink-0">

    <div className="drawer drawer-open h-full bg-base-200">

      <input
        id="my-drawer-1"
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        onChange={() => setOpen(v => !v)}
      />

      {/* BOTÓN */}
      <div className="drawer-content flex flex-col my-2">
        <label
          htmlFor="my-drawer-1"
          className="btn btn-square btn-ghost"
        >
        <ChevronsRight
          className={`size-8 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        </label>
      </div>

      {/* SIDEBAR REAL */}
      <div className="drawer-side pointer-events-auto static translate-x-0 h-full">

        <div
          className={`
          bg-primary/70
          rounded-r-4xl
          h-full
          flex flex-col
          overflow-hidden
          transition-[width]
          duration-300
          ease-in-out
          ${open ? "w-36" : "w-16"}
          `}
        >
        <NavBarTitle isOpen={open} />

        <h2 className="text-center font-medium">Menu</h2>

        <ul className="flex flex-col h-full items-center">
          <NavItem Icon={Home} to="/" />
          <NavItem Icon={ShoppingCart} to="/cart" />
          <NavItem Icon={PackageSearch} to="/inventory" />

          <li className="flex mt-auto mb-5 gap-1 items-center">
            <Cog className="size-8" />
            <span className={open ? "block" : "hidden"}>Config</span>
          </li>
        </ul>

        </div>

      </div>
    </div>
  </aside>

  )
}
