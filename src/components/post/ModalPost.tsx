import React from 'react'
import {Avatar, Input} from '@/components'
import { useAppSelector } from '@/redux/hooks'
import { selectUser } from '@/redux/features/user/userSlice'
import { BiImageAdd } from "react-icons/bi";

const ModalPost = () => {
  const user = useAppSelector(selectUser)
  const fullName = `${user.firstName} ${user.lastName}`
  return (
    <dialog id="my_modal" className="modal ">
        <div className="modal-box bg-navbar max-h-[800px]">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-xl text-textColor text-center">Create Post</h3>
        <div className='divider'></div>
        <div className="flex h-full gap-2 items-center">
          <Avatar className='w-[42px] h-[42px]' alt='avatar' width={1} height={1} />
          <span className='text-lg  text-textColor font-bold'>{fullName}</span>
        </div>
        <div>
        <textarea className="textarea px-1 py-4 bg-navbar text-lg w-full h-auto resize-none placeholder:text-sm " placeholder="What are you thinking?"></textarea>
        <div className='w-full h-[200px] p-3 rounded-xl border-solid border-gray-50 border-[1px]'>
            <div className='bg-backgroundImg cursor-pointer hover:opacity-40 flex flex-col justify-center items-center w-full h-full rounded-xl'>
                <BiImageAdd className='text-4xl' />
                <span className='text-textColor font-bold'>Add your favorite images</span>
                <span className='text-sm'>or drag and drop</span>
            </div>
        </div>
        </div>
      </div>
    </dialog>
  )
}

export default ModalPost