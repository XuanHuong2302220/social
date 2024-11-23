'use client'

import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { MdOutlineSearch } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import {Input, DropDown, Button, Modal, Avatar} from '@/components'
import { IoSunny } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTheme } from '@/redux/features/theme/themeSlice';
import { GoTriangleDown } from "react-icons/go";
import useClickOutside from '@/hooks/useClickOutside';
import { cleaerUser, selectUser } from '@/redux/features/user/userSlice';
import { IoLogOut } from "react-icons/io5";
import { clearToken } from '@/redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';

const Navbar = () => {

  const search = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const theme = useAppSelector((state) => state.theme.theme)
  const dispatch = useAppDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownLogout, setShowDropdownLogout] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if(search.current){
      search.current.value = e.target.value;
      setShowDropdown(e.target.value.length > 0)
    }
  }, [])

  const handleClickTheme = (theme: string)=> {
    dispatch(setTheme(theme))
    console.log(theme)
    setShowDropdownLogout(false)
    document.documentElement.setAttribute('data-theme', theme);
  }

  const handleLogout =()=> {
    setLoading(true)
    dispatch(clearToken())
    router.push('/login')
  }

  const handleRedirect = ()=> {
    window.window.location.href = `/${user.username}`
  }

  useClickOutside(dropdownRef, ()=> setShowDropdownLogout(false))

  const user = useAppSelector(selectUser);
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <div className={`w-full z-50 h-[65px] flex flex-wrap items-center bg-navbar px-7 justify-between fixed border-b border-b-background`}>
        <div className='flex w-1/3 gap-4 items-center h-full'>
          <a href="/">
            <Logo size='text-3xl' width={30} />
          </a>

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
              iconComponent={showDropdown ? null : <MdOutlineSearch />}
              ref={search}
              onChange={handleSearch}
              />
            } 
            children={
              showDropdown && 
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center p-2 cursor-pointer gap-2 rounded-lg hover:bg-navbar'>
                    <Avatar src='' alt='search' width={1} height={1} className='w-8 h-8' />
                    <span className='text-textColor'>User Search</span>
                  </div>
                  <div className='flex items-center p-2 cursor-pointer gap-2 rounded-lg hover:bg-navbar'>
                    <Avatar src='' alt='search' width={1} height={1} className='w-8 h-8' />
                    <span className='text-textColor'>User Search</span>
                  </div>
                  <div className='flex items-center p-2 cursor-pointer gap-2 rounded-lg hover:bg-navbar'>
                    <Avatar src='' alt='search' width={1} height={1} className='w-8 h-8' />
                    <span className='text-textColor'>User Search</span>
                  </div>
                </div>
            }
          />

        </div>
        <div className='flex gap-8 items-center text-whiteText h-full'>

          {theme === 'dark' ? 
            <FaMoon className='text-xl cursor-pointer text-textColor' onClick={()=> handleClickTheme('light')} /> : 
            <IoSunny className='text-xl cursor-pointer text-textColor' onClick={()=> handleClickTheme('dark')} /> 
          }

          <FaMessage className='text-xl cursor-pointer text-textColor'  />

          <IoNotifications className='text-xl cursor-pointer text-textColor' />
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
                  onClick={()=> setShowDropdownLogout(!showDropdownLogout)}
                />
              }
              children={showDropdownLogout &&
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
            />
          </div>
        </div>

      {loading && <Modal 
          className='w-[200px] h-fit flex justify-center items-center bg-navbar'
          children={
            <span className='font-bold text-textColor text-lg'>Logging out...</span>
          }
        />}

    </div>
  )
}

export default memo(Navbar)