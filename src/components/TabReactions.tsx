'use client'

import React, { useEffect, useState } from 'react'
import {Avatar, Button, Modal, SkeletonReaction} from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { InteractProps, Reaction } from '@/types'
import { reactions } from '@/utils/reactions'

interface ReactionRespone{
  type: string;
  count: number
}

interface TabsProps {
  typeReaction: ReactionRespone[],
  listReaction: Reaction[],
  loading: boolean,
  onClose: () => void
}

interface ReactionProps {
  type: InteractProps;
  count: number;
}

const TabReactions = ({typeReaction, listReaction, loading, onClose}: TabsProps) => {

  const [activeTab, setActiveTab] = useState(0);
  const [getListReaction, setListReaction] = useState<Reaction[]>([])
  const [cloneListReaction, setCloneListReaction] = useState<Reaction[]>([])
  const [headerReaction, setHeaderReaction] = useState<ReactionProps[]>([{
    type: {
      name: 'All',
      icon: null,
      color: ''
    },
    count: 0
  }])

    const handleSelectReaction = (index: number, type: string) => {
      setActiveTab(index)
      if(index !== 0) {
        setListReaction(()=>listReaction.filter(reaction => reaction.reaction_type === type))
      }
      else if(index === 0) {
        setListReaction(cloneListReaction)
      }
    }

      const handleCloseModalReactions = () => {
        onClose()
        setHeaderReaction([{
          type: {
            name: 'All',
            icon: null,
            color: ''
          },
          count: 0
        }])
        setListReaction([])
      }

      useEffect(()=> {
        if(typeReaction){
          setHeaderReaction(prevState => [
            ...prevState, 
            ...typeReaction.flat().map(reaction => {
              const matchedReaction = reactions.find(r => r.name === reaction.type);
              if(matchedReaction)
                return {
                  type: {
                    name: matchedReaction.name,
                    icon: matchedReaction.icon,
                    color: matchedReaction.color
                  },
                  count: reaction.count
                };
            }).filter((reaction): reaction is ReactionProps => reaction !== undefined)
          ])
        }
      
      }, [typeReaction])

      useEffect(()=> {
        if(listReaction){
          setListReaction(listReaction)
          setCloneListReaction(listReaction)
        }
      }, [listReaction])

  return (

      <Modal
        onClose={handleCloseModalReactions}
        closeIcon
      >
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
                <Avatar id={reaction.user.id} width={1} src={reaction.user.avatar ?? undefined} height={1} alt='avatar' className='w-[42px] h-[42px]'/>
                <div className='flex flex-col'>
                  <a href={`/${reaction.user.userName}`} className='font-bold hover:underline text-textColor'>{reaction.user.fullName}</a>
                </div>
              </div>
              <div className='flex gap-2 items-center'>
                <Image src={reactions.find(r => r.name === reaction.reaction_type)?.icon.src} alt={reaction.reaction_type} width={30} height={30} />
              </div>
            </div>
            ))}
        </div> 
      </Modal>
    )

}

export default TabReactions