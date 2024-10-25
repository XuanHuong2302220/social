import React from 'react'
import Image, { StaticImageData } from 'next/image'


interface InteractProps {
    onClick: (reaction: {name: string, icon: StaticImageData, color: string}) => void,
    reactions: Array<{name: string, icon: StaticImageData, color: string}>;
    onMouseEnter?: () => void,
    onMouseLeave?: () => void
}

const Interact = ({onClick, reactions, onMouseEnter, onMouseLeave}: InteractProps) => {

  return (
    <div className='absolute w-[340px] top-[-60px] h-auto gap-1  bg-search z-50 flex p-2 rounded-xl' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {reactions.map((reaction, index)=> (
            <Image 
                onClick={() => onClick(reaction)} 
                key={index} 
                className='hover:scale-125 cursor-pointer' 
                src={reaction.icon} 
                width={50} 
                height={50} 
                alt={reaction.name} 
            />
        ))}
        
    </div>
  )
}

export default Interact