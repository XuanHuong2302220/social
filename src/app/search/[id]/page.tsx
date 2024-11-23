'use client'

import { Avatar, Button } from '@/components'
import Layout from '@/components/DefaultLayout'
import React from 'react'

const Search = () => {
  return (
    <Layout>
        <div className="bg-background flex flex-col items-center pt-[90px] h-screen">
            <div className='flex flex-col bg-navbar rounded-lg w-1/2 p-3'>
                <span className='text-textColor text-2xl font-bold'>Every One</span>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-2 p-2'>
                        <Avatar width={1} height={1} src='' alt='search' className='w-12 h-12' />
                        <div className='flex flex-col'>
                            <span className='text-textColor text-lg font-bold'>User Search</span>
                            <span className='text-sm text-textColor'>Following</span>
                        </div>
                        <Button  text='Message' className='text-textColor bg-primaryColor ml-auto' />
                    </div>
                    <div className='flex items-center gap-2 p-2'>
                        <Avatar width={1} height={1} src='' alt='search' className='w-12 h-12' />
                        <div className='flex flex-col'>
                            <span className='text-textColor text-lg font-bold'>User Search</span>
                            <span className='text-sm text-textColor'>Following</span>
                        </div>
                        <Button text='Message' className='text-textColor bg-primaryColor ml-auto' />
                    </div>
                    <div className='flex items-center gap-2 p-2'>
                        <Avatar width={1} height={1} src='' alt='search' className='w-12 h-12' />
                        <div className='flex flex-col'>
                            <span className='text-textColor text-lg font-bold'>User Search</span>
                            <span className='text-sm text-textColor'>Following</span>
                        </div>
                        <Button text='Message' className='text-textColor bg-primaryColor ml-auto' />
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Search