'use client'

interface UseOpenModal {
    id: string,
}

const useOpenModal = ({id}: UseOpenModal) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) {
        return {
            show: () => modal.showModal(),
            close: () => modal.close(),
        };
    }
    return null;
}

export default useOpenModal;