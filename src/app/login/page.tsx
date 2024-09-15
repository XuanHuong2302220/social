import React from 'react'
import { Input } from '@/components'
import userIcon from '@/assets/icons/user.svg'
import password from '@/assets/icons/password.svg'

const Login = () => {
  return (
    <div className="w-screen h-screen bg-white">
        <form className='w-2/4'>
            <span>Welcome</span>
            <span>We are glad to see you back with me</span>
            <Input placeholder='username or email' type='text' icon={userIcon} />
            <Input placeholder='password' type='password' icon={password}/>
            <Button />
            <span>Login</span>
            <span>with Others</span>
            <Button />
            <Button />
        </form>
    </div>
  )
}

export default Login