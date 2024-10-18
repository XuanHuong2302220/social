import { ModalProps } from '@/types'
import React from 'react'

const Modal = ({id, title, children, onClose, closeIcon, className}:ModalProps) => {
  return (
    <dialog id={id} className="modal">
        <div className={`modal-box ${className}`}>
           {closeIcon &&  <form method="dialog">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>}
            {title}
            {children}
        </div>
    </dialog>
  )
}

export default Modal