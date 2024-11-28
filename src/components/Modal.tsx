import { ModalProps } from '@/types'
import React, { useEffect, useRef } from 'react'

const Modal = ({title, children, onClose, closeIcon, className}:ModalProps) => {

  const modalRef = useRef<HTMLDialogElement>(null)

  const handleCloseModal = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.close();
      onClose && onClose();
    }
  }

  useEffect(() => {
    const modal = modalRef.current;
    if (modal) {
      modal.showModal();
    }
  }, []);

  return (
    <dialog ref={modalRef} className="modal">
        <div className={`modal-box ${className}`}>
           {closeIcon && 
                <button onClick={handleCloseModal} className="btn btn-sm btn-circle text-textColor btn-ghost absolute right-2 top-2">✕</button>
            }
            {title}
            {children}
        </div>
    </dialog>
  )
}

export default Modal