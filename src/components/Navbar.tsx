import React from 'react'
import Logo from './Logo'
import Input from './input/Input'
import { MdOutlineSearch } from "react-icons/md";
import { TiDelete } from "react-icons/ti";

const Navbar = () => {
  return (
    <div className='w-screen h-[65px] bg-navbar flex items-center px-7'>
        <div className='flex w-1/3 gap-4 items-center h-full  '>
          <Logo size='text-3xl' width={30} />
          <Input
            placeholder='Search...'
            className='h-8 bg-search'
            type='text'
            classInput='text-white'
            iconComponent={<MdOutlineSearch />}
          />
        </div>
    </div>
  )
}

export default Navbar