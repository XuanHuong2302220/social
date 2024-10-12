'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button, DropDown} from '@/components'
import { useAppSelector } from '@/redux/hooks'
import { selectUser } from '@/redux/features/user/userSlice'
import { BiImageAdd } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/firebase/firebase'
import Image from 'next/image'
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { IoChevronForwardSharp } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { TbBoxMultiple } from "react-icons/tb";
import { IoIosAdd } from "react-icons/io";
import useClickOutside from '@/hooks/useClickOutside'

const ModalPost = () => {
  const user = useAppSelector(selectUser)
  const fullName = `${user.firstName} ${user.lastName}`
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)  
  const [images, setImages] = useState<string[]>([])
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null)

  useClickOutside(buttonRef, (event)=> {
      setShowDropdown(false);
      console.log(showDropdown)
  })

  const handleOpenFile = () => {
    inputFileRef.current?.click();
  }

  const handleOpenDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowDropdown(prev => !prev)
  }

  useEffect(() => {
    // Ensure Swiper updates navigation elements after they are rendered
    const swiperElement = document.querySelector('.mySwiper') as HTMLElement & { swiper: any };
    const swiper = swiperElement?.swiper;
    if (swiper) {
      swiper.on('slideChange', () => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      });
      swiper.navigation.update();
    }
  }, [images]);

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      try {
        setFile(file)
        const url = URL.createObjectURL(file);
        // const storageRef =  ref(storage, `images/${file.name}`);
        // await uploadBytes(storageRef, file);
        // const url = await getDownloadURL(storageRef);
        setImages((prevImages) => [...prevImages, url])
        console.log(showDropdown)
      } catch (error) {
        console.log(error)
      }
    }
  }

  console.log(showDropdown)

  const clearImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
    if(images.length === 1){
      setShowDropdown(false)
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
        <div className={`w-full ${images.length > 0 ? 'h-[300px]' : 'h-[200px]'} relative p-3 rounded-xl border-solid border-gray-50 border-[1px]`}>
            
            {images.length > 0 ? 
             <>
              <Swiper  
                navigation={{
                  prevEl: '.custom-prev',
                  nextEl: '.custom-next',
                }}  
                modules={[Navigation]} 
                className="mySwiper h-full"
              >
                {images?.map((image, index) => (
                   <SwiperSlide key={index}>
                   <Image alt={image} src={image} layout="fill" objectFit='contain' />
                 </SwiperSlide>
                ) )}
                
               <div className='absolute bottom-1 right-2 z-20 '>
                 <DropDown
                  parents={
                    <Button
                      icon={<TbBoxMultiple />}
                      ref={buttonRef}
                      onClick={handleOpenDropdown}
                      left
                      className="pointer-events-auto bg-backgroundIcon border-backgroundIcon opacity-100 hover:opacity-80 rounded-full p-0 w-[30px] h-[30px] min-h-[30px]"
                    />
                  }
                  tabIndex={0}
                  position='top'
                  classNameContent='max-w-[400px] overflow-x-auto overflow-y-hidden p-4 h-[130px] bg-backgroundIcon absolute right-0 mb-2 border-backgroundIcon z- rounded-lg'
                  children={
                    showDropdown && <div className='flex gap-2 items-center' style={{ width: `${images.length * 150}px`, maxWidth: '500px' }}>
                      {images?.map((image, index) => (
                      <div key={index} className='w-[100px] h-[100px] relative'>
                        <Image alt={image} src={image} layout='fill' objectFit='cover' />
                        {index === 0 && <Button
                          icon={<IoCloseOutline />}
                          left
                          onClick={()=>clearImage(index)} 
                          className='absolute top-1 right-1 bg-backgroundIcon border-backgroundIcon rounded-full p-0 w-[20px] h-[20px] min-h-[20px]'
                        />}
                      </div>
                    ))}
                    <Button 
                      left
                      icon={<IoIosAdd />}
                      className='bg-search border-search rounded-full text-4xl p-0 w-[60px] h-[60px] min-h-[60px] hover:opacity-80'
                      onClick={handleOpenFile}
                    />
                    </div>
                  }
                 />
               </div>
              </Swiper>
                <div className={`custom-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10 `}>
                  <Button  left icon={<IoChevronBackOutline />} className={`bg-backgroundIcon border-backgroundIcon rounded-full p-0 w-[30px] h-[30px] min-h-[30px] ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} />
                </div>
                <div className={`custom-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10 `}>
                  <Button left icon={<IoChevronForwardSharp />} className={`bg-backgroundIcon border-backgroundIcon opacity-100 rounded-full p-0 w-[30px] h-[30px] min-h-[30px]  ${isEnd ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} />
                </div>
             </>
             :
              <div onClick={handleOpenFile} className='bg-backgroundImg cursor-pointer hover:opacity-40 flex flex-col justify-center items-center w-full h-full rounded-xl'>
                <BiImageAdd className='text-4xl' />
                  <span className='text-textColor font-bold'>Add your favorite images</span>
                  <span className='text-sm'>or drag and drop</span>
              </div>
            }
        </div>
        <input ref={inputFileRef} onChange={handleImportFile} type="file" className="hidden" />
        </div>
      </div>
    </dialog>
  )
}

export default ModalPost