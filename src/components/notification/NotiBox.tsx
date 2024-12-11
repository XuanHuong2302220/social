'use client'

import React from 'react'

const NotiBox = () => {
    return (
        <div className='flex flex-col z-50'>
            <span className='text-textColor py-3 font-bold text-2xl px-4'>Notify</span>
            <div className='divider m-0 bg-background h-[1px]' />
            <div className='flex flex-col gap-2 mt-3 px-4'>
                <div className='flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-search'>
                    <div className='w-12 h-12 rounded-full bg-primaryColor' />
                    <div className='flex flex-col'>
                        <span className='text-textColor text-lg font-bold'>User name</span>
                        <span className='text-sm text-textColor'>Content</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotiBox