import React from 'react'

import { Link } from "react-router-dom"

export const Dropdown = ({ sku, onDelete }) => {
  return (
    <div className="dropdown dropdown-left">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-xs"
      >
        ...
      </div>

      <ul
        tabIndex={-1}
        className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow text-xs"
      >
        <li>
          <Link to={`/inventory/${sku}/edit`}>
            Editar
          </Link>
        </li>

        <li>
          <button
            className="text-error"
            onClick={() => onDelete(sku)}
          >
            Eliminar
          </button>
        </li>
      </ul>
    </div>
  )
}

