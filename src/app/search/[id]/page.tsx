'use client'

import useCreateConversation from '@/api/messages/createConversation'
import useSearch from '@/api/user/searchUser'
import { Avatar, Button, Post } from '@/components'
import Layout from '@/components/DefaultLayout'
import useSocket from '@/socket/socket'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const Search = () => {

    const {result, searchUser, postResult} = useSearch()

    const socket = useSocket('users')

    const {id} = useParams() as { id: string }

    const {createConversation} = useCreateConversation()

    const handleCreateConversation = async (receiverId: string) => {
        await createConversation(receiverId)
    }

    useEffect(()=> {
        searchUser(id)
    }, [id])

  return (
    <Layout socket={socket}>
        <div className="bg-background flex flex-col items-center gap-5 pt-[90px] h-screen overflow-y-auto">
            {result.length > 0 && 
            <div className='flex flex-col bg-navbar rounded-lg w-1/2 p-3'>
                <span className='text-textColor text-2xl font-bold'>Every One</span>
                <div className='flex flex-col'>
                    {result.map((user)=>(
                        <div key={user.id} className='flex items-center gap-2 p-2'>
                            <a href={`/${user.username}`}>
                                <Avatar width={1} id={user.id} height={1} src={user.avatar ?? undefined} alt='search' className='w-12 h-12' />
                            </a>
                            <div className='flex flex-col'>
                                <a href={`/${user.username}`} className='text-textColor text-lg font-bold'>{user.fullName}</a>
                               <span className='text-sm text-primaryColor'>{user.isFollowing}</span>
                            </div>
                            <Button onClick={()=>handleCreateConversation(user.id)} text='Message' className='text-textColor bg-primaryColor ml-auto' />
                        </div>
                    ))}
                </div>
            </div>}
            

            {postResult.length > 0 && <div className='flex flex-col rounded-lg gap-5 w-1/2 p-3'>
                <span className='text-textColor text-2xl font-bold text-s'>Post Results</span>
                <div className='flex flex-col gap-3'>
                    {postResult.map((post)=>(
                        <Post key={post.id} post={post} width={700} />
                    ))}
                </div>
            </div>}
        </div>
    </Layout>
  )
}

export default Search