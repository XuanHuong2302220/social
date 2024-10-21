'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button, DropDown, Modal} from '@/components'
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
import useOpenModal from '@/hooks/useOpenModal'
import useCreatePost from '@/api/post/createPost'
import { HighlightWithinTextarea } from 'react-highlight-within-textarea'
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { BsEmojiSmile } from "react-icons/bs";

const ModalPost = () => {
  const user = useAppSelector(selectUser)
  const fullName = `${user.firstName} ${user.lastName}`
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])  
  const [images, setImages] = useState<string[]>([])
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const swiperRef = useRef<any>(null)
  const [indexImg, setIndexImg] = useState<number>(0)
  const [text, setText] = useState('')
  const [openEmoji, setOpenEmoji] = useState(false)
  const textareaRef = useRef<any>(null)
  const [loadingImage, setLoadingImage] = useState(false)
  
  const onChange = (text: React.SetStateAction<string>) => setText(text);

  const {loading, createPost} = useCreatePost();

  useClickOutside(dropdownRef, ()=> {
    setShowDropdown(false);
  })

  useClickOutside(emojiRef, ()=> {
    setOpenEmoji(false);
  })

  useEffect(() => {
    // Thay đổi style của placeholder khi component được render
    const placeholderElement = document.querySelector('.public-DraftEditorPlaceholder-root');
    if (placeholderElement && placeholderElement instanceof HTMLElement && images.length > 0) {
      placeholderElement.style.position = 'absolute';
      placeholderElement.style.top = '25%';
    }
    else if (placeholderElement && placeholderElement instanceof HTMLElement && images.length === 0) {
      placeholderElement.style.position = 'absolute';
      placeholderElement.style.top = '30%';
    }
  }, [ images.length > 0]);

  // open file
  const handleOpenFile = () => {
    inputFileRef.current?.click();
  }

  const handleEmojiClick = (emojiObject: any) => {
    setText((prevText) => prevText + emojiObject.emoji);
    console.log(emojiObject.emoji);
  }

  const closeModalPost = useOpenModal({id: 'modal_post'})
  const closeModalNewPost = useOpenModal({id: 'my_modal'})

  const handleOpenDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowDropdown(prev => !prev)
  }

  const openModalImage = useOpenModal({id: 'modal_image'})
  
  const handleCloseModal = (leave : boolean) => {
    if(images.length > 0 || text){
      closeModalPost?.show()
    }
    
    if(leave || images.length === 0 && !text){
      setImages([])
      if(text){
        setText('')
      }
      closeModalNewPost?.close();
      closeModalPost?.close();
    }
  }


  const handleOpenModal = (index: number) => {
    setIndexImg(index)
    openModalImage?.show()
    console.log(indexImg)
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
    const file = e.target.files?.[0]
    console.log(file)
    if(file){
      try {
        setFiles((prevFile) => [...prevFile, file])
        const url = URL.createObjectURL(file);
        setImages((prevImages) => [...prevImages, url])
      } catch (error) {
        console.log(error)
      }
    }
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
  }

  useEffect(()=> {
    if(textareaRef.current){
      textareaRef.current.focus()
    }
  }, [])

  const clearImage = (index: number) => {
    console.log(index)
    setImages((prevImages) => {
      const newImages = [...prevImages];
      URL.revokeObjectURL(newImages[index]);
      newImages.splice(index, 1);
      return newImages;
    });
    setFiles((preFile)=> {
      const newFile = [...preFile];
      newFile.splice(index, 1);
      return newFile;
    })
    setIndexImg(0)
    openModalImage?.close()
    setShowDropdown(false)
  }

  const handleImageClick = (index: number) => {
    setIndexImg(index)
    if(swiperRef.current){
      swiperRef.current.slideTo(index)
    }
  }

  const handleSubmit = async () => {
    if (text || images.length > 0) {
      try {
        const uploadedFiles = await Promise.all(
          files.map(async (file) => {
            const storageRef = ref(storage, `images/${file.name}`);
            try {
              setLoadingImage(true)
              const url = await getDownloadURL(storageRef);
              return url;
            } catch (error) {
              setLoadingImage(true)
              if ((error as any).code === 'storage/object-not-found') {
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                return url;
              }
              throw error;
            }
            finally {
              setLoadingImage(false)
            }
          })
        );
        await createPost({
          description: text,
          images: uploadedFiles,
        });

        setImages([]);
        setText('');
        setFiles([]);
        setIndexImg(0);
        closeModalNewPost?.close();
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };
  

  return (
    <dialog id="my_modal" className="modal">
        <div className="modal-box p-2 bg-navbar max-h-[700px] h-auto overflow-y-hidden" >
          <button onClick={()=>handleCloseModal(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <h3 className="font-bold text-xl text-textColor text-center">Create Post</h3>
          <div className='divider'></div>
          <div className="flex h-full gap-2 items-center">
              <Avatar className='w-[42px] h-[42px]' alt='avatar' width={1} height={1} />
              <span className='text-lg  text-textColor font-bold'>{fullName}</span>
            </div>
          <div className='overflow-y-auto max-h-[450px]'>
            <div>
                <HighlightWithinTextarea
                  value={text}
                  highlight={[{highlight: /#[\w]+/g, className: 'text-blue-500 bg-transparent'}]}
                  onChange= {onChange}
                  placeholder='What are you thinking?'
                />
           
              {/* <textarea value={text} onChange={handleTextareChange} className={`textarea px-1 py-4 bg-navbar text-sm w-full h-auto resize-none placeholder:text-sm ${checkHastag ? 'text-blue-300' : 'text-textColor'}`} placeholder="What are you thinking?"></textarea> */}
              <div className={`w-full ${images.length > 0 ? 'h-[300px]' : 'h-[200px]'} relative p-3 rounded-xl border-solid border-gray-300 border-[1px]`}>
            
                {images.length > 0 ?
                <>
                  <Swiper
                    onSwiper={(swiper) => swiperRef.current = swiper}
                    initialSlide={indexImg}
                    navigation={{
                      prevEl: '.custom-prev',
                      nextEl: '.custom-next',
                    }}
                    modules={[Navigation]}
                    className="mySwiper h-full"
                  >
                    {images?.map((image, index) => (
                      <SwiperSlide key={index}>
                        <Image alt={image} src={image} layout="fill"  style={{ objectFit: 'contain' }} />
                    </SwiperSlide>
                    ) )}
            
                  <div ref={dropdownRef} className='absolute bottom-1 right-2 z-20 '>
                    <DropDown
                      parents={
                        <Button
                          icon={<TbBoxMultiple />}
                          // ref={buttonRef}
                          onClick={handleOpenDropdown}
                          left
                          className="pointer-events-auto bg-backgroundIcon border-backgroundIcon opacity-100 hover:opacity-80 rounded-full p-0 w-[30px] h-[30px] min-h-[30px]"
                        />
                      }
                      tabIndex={0}
                      position='top'
                      classNameContent='max-w-[400px] overflow-x-auto overflow-y-hidden p-4 h-[130px] bg-backgroundIcon absolute right-0 mb-2 border-backgroundIcon z- rounded-lg'
                      children={
                        showDropdown && <div className='flex gap-2 items-center' style={{ width: `${images.length === 1 ? images.length * 160 : images.length * 140}px`, maxWidth: '500px' }}>
                          {images?.map((image, index) => (
                          <div key={index} className='w-[100px] h-[100px] relative cursor-pointer' onClick={()=>handleImageClick(index)} >
                            <Image alt={image} src={image} layout='fill' objectFit='cover' className={index === indexImg ? 'opacity-100' : 'opacity-30'} />
                            {index === indexImg && <Button
                              icon={<IoCloseOutline />}
                              left
                              onClick={()=>handleOpenModal(index)} 
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
              {/* modal close image */}
              <Modal
                id='modal_image'
                title={
                  <div className='flex flex-col py-2 justify-between items-center'>
                    <h3 className='text-lg font-bold text-textColor'>Discard Photo</h3>
                    <span className='text-sm'>This will remove the photo from your post.</span>
                  </div>
                }
                className='w-2/3 '
                children={
                  <div className='flex flex-col gap-2'>
                    <Button onClick={()=> clearImage(indexImg)} text='Discard' className='w-full bg-transparent text-red-700' />
                    <form method="dialog"><Button text='Cancel' className='w-full  text-textColor' /></form>
                  </div>
                }
              />
              {/* modal close post */}
              <Modal
                id='modal_post'
                title={
                  <div className='flex flex-col py-2 justify-between items-center'>
                    <h3 className='text-lg font-bold text-textColor'>Leave?</h3>
                    <span className='text-sm'>Changes you made may not be saved</span>
                  </div>
                }
                className='w-2/3 '
                children={
                  <div className='flex flex-col gap-2'>
                    <Button onClick={()=>handleCloseModal(true)} text='Leave' className='w-full bg-transparent text-red-700' />
                    <form method="dialog"><Button text='Cancel' className='w-full  text-textColor' /></form>
                  </div>
                }
              />

            </div>
          </div>
          <Button text={
            loading || loadingImage ? null : 'Post'
          } 
          onClick={handleSubmit} 
          disabled={loading || loadingImage || (text === '' && images.length === 0)}  
          className='w-full bg-primaryColor text-textColor hover:bg-primaryColor hover:opacity-50 my-3' 
          iconLoading={loading || loadingImage} 
          />

          <div className={`absolute right-[5px] cursor-pointer ${images.length > 0 ? 'top-[25%]' : 'top-[30%] '}`}>
            <BsEmojiSmile onClick={()=> setOpenEmoji(!openEmoji)} />
          </div>
          
      </div>
          <div className={`absolute ${images.length > 0 ? 'top-[36%]' : 'top-[42%]'}  right-[53%] `} ref={emojiRef}>
            <EmojiPicker
              open={openEmoji}
              style={{position: 'absolute'}}
              width={300}
              height={350}
              theme={Theme.DARK}
              onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
            />
          </div>
    </dialog>
  )
}

export default ModalPost