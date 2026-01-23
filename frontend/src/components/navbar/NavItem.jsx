import React from 'react'
import { Link } from 'react-router'

export const NavItem = ({Icon,to}) => {

  // manejar redirección
  return (
    <li className='my-4'>
        <Link to={to} className="flex items-center
                    is-drawer-close:justify-center
                    is-drawer-open:justify-start
                    ">
        <div className="p-3 rounded-lg hover:bg-primary/80 transition-colors">
            <Icon className="size-8 shrink-0 mx-2" ></Icon>
        </div>
        <span className="is-drawer-close:hidden
          whitespace-nowrap
          transition-all
          duration-200
          ease-in-out
          is-drawer-close:opacity-0
          is-drawer-close:translate-x-2
          is-drawer-open:opacity-100
          is-drawer-open:translate-x-0
          "
        >
            Item 1
        </span>
        </Link>
    </li>
  )
}
