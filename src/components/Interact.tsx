import React from 'react'
import Image, { StaticImageData } from 'next/image'

interface InteractProps {
    onClick: (reaction: {name: string, icon: StaticImageData, color: string}) => void,
    reactions: Array<{name: string, icon: StaticImageData, color: string}>,
    onMouseEnter?: () => void,
    onMouseLeave?: () => void,
    isComment?: boolean,
    backgroundColor?: string
}

const Interact = ({onClick, reactions, onMouseEnter, onMouseLeave, isComment, backgroundColor}: InteractProps) => {

  return (
    <div 
      className={`absolute h-auto gap-1 ${backgroundColor ? backgroundColor : 'bg-gray-800'} z-50 flex p-2 rounded-xl`} 
      style={{width : isComment ? '215px' : '340px', top: isComment ? '-50px' : '-60px'}} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
        {reactions.map((reaction, index)=> (
            <Image 
              onClick={() => onClick(reaction)} 
              key={index} 
              className='hover:scale-125 cursor-pointer' 
              src={reaction.icon} 
              width={isComment ? 30 : 50} 
              height={isComment ? 30 : 50} 
              alt={reaction.name} 
            />
        ))}
        
    </div>
  )
}

export default Interact