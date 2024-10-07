'use client'

import { useEffect } from "react"

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
    useEffect(()=> {
        const handlClickOutside = (event: MouseEvent | TouchEvent) => {
            if(ref.current && !ref.current.contains(event.target as Node)){
                handler(event)
            }
        }

        document.addEventListener('mousedown', handlClickOutside)

        return ()=> {
            document.removeEventListener('mousedown', handlClickOutside)
        }

    }, [ref, handler])

}

export default useClickOutside