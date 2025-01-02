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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Esc
      }
    };

    const modal = modalRef.current;
    if (modal) {
      modal.showModal();
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (modal) {
        modal.close();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
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