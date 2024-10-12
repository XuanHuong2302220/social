'use client'

import { useEffect } from "react"

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
    useEffect(()=> {
        const handlClickOutside = (event: MouseEvent | TouchEvent) => {
            if(ref.current && !ref.current.contains(event.target as Node)){
                handler(event)
            }
        }

        document.addEventListener('click', handlClickOutside)

        return ()=> {
            document.removeEventListener('click', handlClickOutside)
        }

    }, [ref, handler])

}

export default useClickOutside