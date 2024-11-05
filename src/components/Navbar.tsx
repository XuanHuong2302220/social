'use client'

import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { MdOutlineSearch } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import {Input, DropDown, Button} from '@/components'
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
    router.push('/login')
    dispatch(clearToken())
  }

  useClickOutside(dropdownRef, ()=> setShowDropdownLogout(false))

  const user = useAppSelector(selectUser);
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <div className={`w-full z-50 h-[65px] flex items-center bg-navbar px-7 justify-between fixed `}>
        <div className='flex w-1/3 gap-4 items-center h-full'>
          <Logo size='text-3xl' width={30} />

          <DropDown 
            className='text-whiteText' 
            classNameContent='bg-search w-[250px]' 
            tabIndex={0}
            parents={
              <Input
              placeholder='Search...'
              className='h-8 bg-search w-[250px]'
              type='text'
              classInput='text-whiteText'
              iconComponent={showDropdown ? null : <MdOutlineSearch />}
              ref={search}
              onChange={handleSearch}
              />
            } 
            children={
              showDropdown && 
                <li><a>Item 1</a></li>
            }
          />

        </div>
        <div className='flex gap-8 items-center text-whiteText h-full'>

          {theme === 'dark' ? 
            <FaMoon className='text-xl cursor-pointer' onClick={()=> handleClickTheme('light')} /> : 
            <IoSunny className='text-xl cursor-pointer' onClick={()=> handleClickTheme('dark')} /> 
          }

          <FaMessage className='text-xl cursor-pointer'  />

          <IoNotifications className='text-xl cursor-pointer' />
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
                <ul >
                  <li><a>Item 1</a></li>
                  <li><Button icon={<IoLogOut className='text-xl' />} left text='Log out' className='flex justify-start' onClick={handleLogout} /></li>
                </ul>
              }
            />
          </div>
        </div>
    </div>
  )
}

export default memo(Navbar)