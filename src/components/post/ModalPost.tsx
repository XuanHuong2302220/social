'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button} from '@/components'
import { useAppSelector } from '@/redux/hooks'
import { selectUser } from '@/redux/features/user/userSlice'
import { BiImageAdd } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/firebase/firebase'


const ModalPost = () => {
  const user = useAppSelector(selectUser)
  const fullName = `${user.firstName} ${user.lastName}`
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)  
  const [image, setImage] = useState<string | null>(null)

  const handleOpenFile = ()=> {
    inputFileRef.current?.click();
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      try {
        setFile(file)
        console.log(file)
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setImage(url)
      } catch (error) {
        console.log(error)
      }
    }
  }

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
        <div className='w-full h-[200px] relative p-3 rounded-xl border-solid border-gray-50 border-[1px]'>
            <div onClick={handleOpenFile} className='bg-backgroundImg cursor-pointer hover:opacity-40 flex flex-col justify-center items-center w-full h-full rounded-xl'>
                <BiImageAdd className='text-4xl' />
                <span className='text-textColor font-bold'>Add your favorite images</span>
                <span className='text-sm'>or drag and drop</span>
                
            </div>
            { <Button 
              icon={<IoCloseOutline />} 
              left 
              className="pointer-events-auto absolute top-5 right-5 z-20 bg-backgroundIcon border-backgroundIcon opacity-100 hover:opacity-80 rounded-full p-0 w-[30px] h-[30px] min-h-[30px]"
            />}
        </div>
        <input ref={inputFileRef} onChange={handleImportFile} type="file" className="hidden" />
        </div>
      </div>
    </dialog>
  )
}

export default ModalPost