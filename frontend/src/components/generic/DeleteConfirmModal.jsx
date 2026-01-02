import React from 'react'

export const DeleteConfirmModal = ({
  open,
  sku,
  onConfirm,
  onCancel
}) => {
  if (!open) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          ¿Eliminar producto?
        </h3>

        <p className="py-4">
          Esta acción no se puede deshacer.
        </p>

        <div className="modal-action">
          <button
            className="btn"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="btn btn-error"
            onClick={() => onConfirm(sku)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

