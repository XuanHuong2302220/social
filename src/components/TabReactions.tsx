'use client'

import React, { useEffect, useState } from 'react'
import {Avatar, Button, SkeletonReaction} from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { InteractProps, Reaction } from '@/types'
import useGetReactions from '@/api/post/getAllReaction'
import { reactions } from '@/utils/reactions'

interface ReactionProps {
  type: InteractProps;
  count: number;
}

interface TabsProps {
  headerReaction: ReactionProps[];
  activeTab: number;
  loading: boolean;
  getListReaction: Reaction[];
  handleSelectReaction: (index: number, type: string) => void;
}

const TabReactions = ({headerReaction,activeTab, loading,getListReaction, handleSelectReaction }: TabsProps) => {
    return (
      <div className='flex flex-col'>
      <div role="tablist" className="tabs tabs-bordered flex ">
        {headerReaction.map((reaction, index)=> (
          <Button 
            key={index}
            left
            icon={reaction.type.icon && <Image src={reaction.type.icon.src} alt={reaction.type.name} width={25} height={25} /> }
            text={`${reaction.count > 0 ? reaction.count : reaction.type.name}`}
            className={`border-transparent rounded-none tab w-[100px] bg-transparent ${activeTab === index ? 'tab-active' : ''}`}
            onClick={()=>handleSelectReaction(index, reaction.type.name)}
            disabled={activeTab === index}
          />
        ))}
      </div>
        { activeTab && 
          loading ? <SkeletonReaction /> :
          getListReaction.map((reaction, index) => (
            <div key={index} className='flex gap-2 items-center justify-between py-2'>
            <div className='flex gap-2 items-center'>
              <Avatar width={1} height={1} alt='avatar' className='w-[42px] h-[42px]'/>
              <div className='flex flex-col'>
                <Link href={'/'} className='font-bold hover:underline text-textColor'>{reaction.user.fullName}</Link>
                {/* <span className='text-[12px]'>20 hours ago</span> */}
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              <Image src={reactions.find(r => r.name === reaction.reaction_type)?.icon.src} alt={reaction.reaction_type} width={30} height={30} />
            </div>
          </div>
        ))}
    </div> 
    )
}

export default TabReactions