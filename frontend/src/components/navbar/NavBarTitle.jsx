import React from 'react'

export const NavBarTitle = () => {
  return (
   <div className="px-4 my-3 pb-4">
        <div className="flex items-center gap-3">
            <svg
                className="size-15 "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                 <path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" />
            </svg>

            <span className="text-xl font-semibold tracking-tight is-drawer-close:hidden">
                App Tienda
            </span>
        </div>
    </div>

  )
}
