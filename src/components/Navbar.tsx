'use client'

import React, { memo, useCallback, useRef, useState } from 'react'
import Logo from './Logo'
import { MdOutlineSearch } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { Input, DropDown, Button, Modal, Avatar, UserChat, NotiBox, ModalPostComment } from '@/components'
import { IoSunny } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTheme } from '@/redux/features/theme/themeSlice';
import { GoTriangleDown } from "react-icons/go";
import useClickOutside from '@/hooks/useClickOutside';
import { selectUser } from '@/redux/features/user/userSlice';
import { IoLogOut } from "react-icons/io5";
import { clearToken } from '@/redux/features/auth/authSlice';
import { usePathname, useRouter } from 'next/navigation';
import useSearch from '@/api/user/searchUser';
import { debounce } from '@/utils/debound';
import { clearConversation } from '@/redux/features/messages/messageSlice';
import useGetAllConversation from '@/api/messages/getAllConversation';
import { setCurrentPage, setHasMore, setPosts } from '@/redux/features/post/postSlice';
import useGetAllPost from '@/api/post/getAllPost';
import useGetAllNoti from '@/api/notify/getAllNoti';
import { PostState } from '@/types';
import axs from '@/utils/axios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const search = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownChatRef = useRef<HTMLDivElement>(null)
  const dropdownNotificationRef = useRef<HTMLDivElement>(null)
  const theme = useAppSelector((state) => state.theme.theme)
  const dispatch = useAppDispatch();
  const [showDropdownLogout, setShowDropdownLogout] = useState(false);
  const [showDropDownChat, setShowDropDownChat] = useState(false);
  const [showDropDownNotification, setShowDropDownNotification] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const token = useAppSelector((state) => state.auth.token)
  const [postNoti, setPostNoti] = useState<PostState | null>(null)
  const [commentId, setCommentId] = useState<string>('')
  const [replyId, setReplyId] = useState<string>('')
  
  const { getAllPost } = useGetAllPost()

  const { loadingSearch, result, searchUser } = useSearch()

  const {loading: loadingNotify ,getAllNotify} = useGetAllNoti()

  const { getAllConversation } = useGetAllConversation();

  const debouncedSearch = useRef(
    debounce((query: string) => {
      searchUser(query);
    }, 500)
  ).current;

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (search.current) {
      search.current.value = e.target.value;
      debouncedSearch(e.target.value)
    }
  }

  const handleOpenNoti = async(post: number, comment: string, parentId?: string)=> {
    try {
      const response = await axs.get(`/post/get-post/${post}`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
      const data = await response.data
      setPostNoti(data)
      if(parentId){
        setCommentId(parentId)
        setReplyId(comment)
      }
      else {
        setCommentId(comment)
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
          toast.error(error.response.data.message);
      } else {
          toast.error("An unexpected error occurred");
      }
    }
    finally{
        setShowDropDownNotification(false)
    }
  }

  const handleClosePostNoti = ()=> {
    setPostNoti(null)
  }

  const handleClickTheme = (theme: string) => {
    dispatch(setTheme(theme))
    setShowDropdownLogout(false)
    document.documentElement.setAttribute('data-theme', theme);
  }

  const pathName = usePathname();
  const isMessagesPath = /^\/messages\/[a-zA-Z0-9-]+$/.test(pathName);
  const isNotHome = pathName !== '/';

  const handleLogout = () => {
    setLoading(true)
    dispatch(clearToken())
    dispatch(clearConversation())
    dispatch(setCurrentPage(1))
    router.push('/login')
  }

  const handleRedirect = () => {
    window.window.location.href = `/${user.username}`
  }

  const handleRedirectSearch = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (search.current && search.current.value.trim() && e.key === 'Enter') {
      window.location.href = `/search/${search.current.value}`
    }
  }

  const handleClickLogo = useCallback(async () => {
    if (isNotHome) {
      window.location.href = '/'
    }
    else {
      dispatch(setCurrentPage(1))
      dispatch(setHasMore(false))
      dispatch(setPosts([]))
      await getAllPost()
    }
  }, [])

  useClickOutside(dropdownRef, () => setShowDropdownLogout(false))
  useClickOutside(dropdownChatRef, () => setShowDropDownChat(false))
  useClickOutside(dropdownNotificationRef, () => setShowDropDownNotification(false))

  const user = useAppSelector(selectUser);
  const fullName = `${user.firstName} ${user.lastName}`

  const handleOpenMessage = async () => {
    setShowDropDownChat(!showDropDownChat);
    setShowDropDownNotification(false)
    setShowDropdownLogout(false)
    await getAllConversation()
  }

  const handleOpenNotification = async () => {
    setShowDropDownNotification(!showDropDownNotification);
    setShowDropDownChat(false)
    setShowDropdownLogout(false)
    await getAllNotify()
  }

  return (
    <div className={`w-full z-50 h-[65px] flex flex-wrap items-center bg-navbar px-7 justify-between fixed border-b border-b-background`}>
      <div className='flex w-1/3 gap-4 items-center h-full'>

        <Logo size='text-3xl' width={30} onClick={handleClickLogo} />

        <DropDown
          className='text-textColor'
          classNameContent='bg-search w-[250px] p-2 rounded-b-lg'
          tabIndex={0}
          parents={
            <Input
              placeholder='Search...'
              className='h-8 bg-search w-[250px] text-textColor'
              type='text'
              classInput='text-textColor'
              iconComponent={MdOutlineSearch}
              ref={search}
              onChange={handleSearch}
              onKeyDown={handleRedirectSearch}
            />
          }
        >
          {
            result.length > 0 &&
            <div className='flex flex-col gap-2'>
              {result.map((user) => (
                <a key={user.id} href={`/${user.username}`} className='flex items-center p-2 cursor-pointer gap-2 rounded-lg hover:bg-navbar'>
                  <Avatar src={user.avatar ?? undefined} id={user.id} alt={user.avatar ?? 'search'} width={1} height={1} className='w-8 h-8' />
                  <span className='text-textColor'>{user.fullName}</span>
                </a>
              ))}
              {loadingSearch && <span className="loading loading-spinner mx-auto text-success"></span>}
            </div>
          }
        </DropDown>

      </div>
      <div className='flex gap-8 items-center text-whiteText h-full'>

        {theme === 'dark' ?
          <FaMoon className='text-xl cursor-pointer text-textColor' onClick={() => { handleClickTheme('light'); setShowDropDownChat(false); setShowDropdownLogout(false); setShowDropDownNotification(false) }} /> :
          <IoSunny className='text-xl cursor-pointer text-textColor' onClick={() => { handleClickTheme('dark'); setShowDropDownChat(false); setShowDropdownLogout(false); setShowDropDownNotification(false) }} />
        }

        {!isMessagesPath && <div className='flex items-cente' ref={dropdownChatRef} >
          <DropDown
            parents={<FaMessage onClick={handleOpenMessage} className='text-xl cursor-pointer text-textColor' />}
            tabIndex={0}
            className='text-whiteText'
            classNameContent='bg-navbar w-[400px] rounded-b-lg menu z-50 top-10 right-[-315px]'
          >
            {
              showDropDownChat && <UserChat isBox backgroundColor='bg-navbar' setShowDropdown={() => setShowDropDownChat(false)} />
            }
          </DropDown>
        </div>}

        <div className='flex items-cente' ref={dropdownNotificationRef} >
          <DropDown
            parents={<IoNotifications onClick={handleOpenNotification} className='text-xl cursor-pointer text-textColor' />}
            tabIndex={0}
            className='text-whiteText'
            classNameContent='bg-navbar w-[400px] rounded-b-lg menu z-50 top-10 right-[-260px]'
          >
            {
              showDropDownNotification && <NotiBox loading={loadingNotify} handleOpenPostNotify={(post, comment, parentId)=> handleOpenNoti(post, comment, parentId)} />
            }
          </DropDown>
        </div>
        <div ref={dropdownRef}>
          <DropDown
            className='text-whiteText w-[200px]'
            classNameContent='bg-search w-[200px] rounded-b-lg menu'
            tabIndex={0}
            parents={
              <Button
                text={fullName}
                className={`text-whiteText bg-search hover:bg-search w-full ${showDropdownLogout && 'rounded-t-lg rounded-b-none'}`}
                icon={<GoTriangleDown />}
                right={true}
                onClick={() => { setShowDropdownLogout(!showDropdownLogout); setShowDropDownChat(false) }}
              />
            }
          >
            {showDropdownLogout &&
              <div className='flex flex-col gap-2'>
                <div onClick={handleRedirect} className='flex items-center gap-2 hover:bg-slate-500 cursor-pointer bg-navbar p-2 rounded-lg'>
                  <Avatar
                    src={user.avatar ?? ''}
                    className='w-8 h-8 rounded-full'
                    alt={user.avatar ?? ''}
                    width={1}
                    height={1}
                  />
                  <span className='font-bold text-textColor text-sm'>{fullName}</span>
                </div>
                <Button
                  icon={<IoLogOut className='text-lg' />}
                  left
                  text='Log out'
                  className='flex justify-start bg-navbar text-textColor'
                  onClick={handleLogout}
                />
              </div>
            }
          </DropDown>
        </div>
      </div>

      {postNoti && 
      <ModalPostComment
        post={postNoti}
        closeFunc={handleClosePostNoti}
        idComment={commentId}
        setIdComment={setCommentId}
        replyId={replyId}
        setReplyId={setReplyId}
      />}

      {loading && <Modal
        className='w-[200px] h-fit flex justify-center items-center bg-navbar'
      >
         <span className='font-bold text-textColor text-lg'>Logging out...</span>
       </Modal> 
        }
    </div>
  )
}

export default memo(Navbar)