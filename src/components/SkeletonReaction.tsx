import React from 'react'

const SkeletonReaction = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-center gap-2 w-full">
        <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
        <div className="skeleton h-8 w-2/4"></div>
      </div>
      <div className="flex items-center gap-2 w-full">
        <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
        <div className="skeleton h-8 w-2/4"></div>
      </div>
      <div className="flex items-center gap-2 w-full">
        <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
        <div className="skeleton h-8 w-2/4"></div>
      </div>
      <div className="flex items-center gap-2 w-full">
        <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
        <div className="skeleton h-8 w-2/4"></div>
      </div>
    </div>
  )
}

export default SkeletonReaction