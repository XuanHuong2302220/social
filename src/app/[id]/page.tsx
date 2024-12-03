'use client'
import useCheckUser from '@/api/user/checkUser'
import { Avatar, Button, DropDown, Input, MiniProfile, Modal, ModalPost, NewPost, Post, SkeletonPost } from '@/components'
import Layout from '@/components/DefaultLayout'
import { selectUser, setAttributes } from '@/redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import NotFound from '../not-found'
import useGetAllPost from '@/api/post/getAllPost'
import InfiniteScroll from 'react-infinite-scroll-component'
import { UserState } from '@/types'
import useCreateFollow from '@/api/follow/createFollow'
import { setPosts } from '@/redux/features/post/postSlice'
import useClickOutside from '@/hooks/useClickOutside'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/firebase/firebase'
import useUpdateAvatar from '@/api/user/updateAvatar'
import useCreateConversation from '@/api/messages/createConversation'
import useGetAllConversation from '@/api/messages/getAllConversation'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from 'react-hook-form'
import useChangePassword from '@/api/user/changePassword'

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {

  const user = useAppSelector(selectUser)
  const {loading: loadingProfile, checkUser, profile} = useCheckUser()

  const { id } = useParams() as { id: string }
  const [isError, setIsError] = useState(false);
  const [main, setMain] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserState>();
  const [avatar, setAvatar] = useState<File | null>(null)
  const [imageAvatar, setImageAvatar] = useState<string | null>(null)
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const {register, handleSubmit, formState: {errors}, reset} = useForm<FormValues>()

  const posts = useAppSelector((state) => state.post.posts);

  const loading = useAppSelector((state) => state.post.loading);

  const hasMore = useAppSelector((state) => state.post.hasMore);

  const {loading: loadingSaveImage, updateAvatar} = useUpdateAvatar()

  const [openDropDown, setOpenDropDown] = useState(false)

  const {getAllPost} = useGetAllPost()

  const {loading: loadingFollow, createFollow, isFollow} = useCreateFollow()

  const {loading: loadingPassword, changePassword} = useChangePassword()

  const {createConversation} = useCreateConversation()

  const scroll = document.querySelector('.my-infinite-scroll') as HTMLElement;
  useEffect(()=> {
    if(scroll){
      scroll.style.overflowY = 'hidden'
    }
  })

  useEffect(()=> {
    if(isFollow !== userProfile?.isFollow){
      if(isFollow === 'follow' || isFollow === 'follow back'){
        console.log(isFollow)
        setUserProfile({
          ...userProfile,
          avatar: userProfile?.avatar ?? '',
          followers: userProfile?.followers ? userProfile.followers - 1 : 0,
          followings: userProfile?.followings ?? 0,
          isFollow: isFollow
        })
      }
      else {
        setUserProfile({
          ...userProfile,
          avatar: userProfile?.avatar ?? '',
          followers: userProfile?.followers ? userProfile.followers + 1 : 0 + 1,
          followings: userProfile?.followings ?? 0,
          isFollow: isFollow
        })
      }
    }
  }, [isFollow])

  const fullName = `${profile?.firstName} ${profile?.lastName}`

  const modalRef = useRef<HTMLDivElement>(null)

  useClickOutside(modalRef, ()=> setOpenDropDown(false))

  const handleChangePassword = async(data: FormValues) => {
    if(data){
      await changePassword(data.currentPassword, data.newPassword, data.confirmPassword)
      reset()
      setIsModalOpen(false)
    }
  }

  const fetchNextPosts = useCallback(async () => {
    try {
      if(userProfile){
        await getAllPost(userProfile.id);
      }
    } catch (error) {
      console.error('Lỗi khi lấy bài đăng tiếp theo:', error);
    }
  }, [loading, hasMore, getAllPost]);

  const handleOpenPostorMessage = () => {
    if(main){
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = ()=> {
    setOpenChangeAvatar(false)
  }

  const handleOpenFileInput = ()=> {
    setImageAvatar(userProfile?.avatar ?? '')
    setOpenChangeAvatar(true)
    setOpenDropDown(false)
  }

  const handleMessage = async() => {
    if(userProfile){
      if(userProfile.id){
        await createConversation(userProfile.id)
      }
    }
  }

  const handleChangAvatar = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      const url = URL.createObjectURL(file);
      if(url){
        setAvatar(file)
        setImageAvatar(url)
      }
    }
  }

  const handleDeleteAvatar = async()=> {
    try {
      setUserProfile({
        ...userProfile,
        avatar: '',
        followers: userProfile?.followers ?? 0,
        followings: userProfile?.followings ?? 0,
        isFollow: userProfile?.isFollow ?? ''
      })
      await updateAvatar('')
    } catch (error) {
      console.error('Lỗi khi xóa ảnh đại diện:', error);
    }
  }

  const handleSaveAvatar = async() => {
    const storageRef = ref(storage, `images/${avatar && avatar.name}`);
      try {
        setLoadingImage(true)
        const url = await getDownloadURL(storageRef);
        setUserProfile({
          ...userProfile,
          avatar: url,
          followers: userProfile?.followers ?? 0,
          followings: userProfile?.followings ?? 0,
          isFollow: userProfile?.isFollow ?? ''
        })
        await updateAvatar(url)
        setOpenChangeAvatar(false)
      } catch (error) {
        setLoadingImage(true)
        if ((error as any).code === 'storage/object-not-found') {
          await uploadBytes(storageRef, avatar as Blob);
          const url = await getDownloadURL(storageRef);
          setUserProfile({
            ...userProfile,
            avatar: url,
            followers: userProfile?.followers ?? 0,
            followings: userProfile?.followings ?? 0,
            isFollow: userProfile?.isFollow ?? ''
          })
          await updateAvatar(url)
          setOpenChangeAvatar(false)
        }
      }
      finally {
        setLoadingImage(false)
      }
  }

  const handleFollow = async() => {
    if(userProfile){
      if(userProfile.isFollow === 'follow' || userProfile.isFollow === 'follow back'){
        if (userProfile.id) {
          await createFollow(userProfile.id, 'create');
        }
      }
      else {
        if (userProfile.id) {
          await createFollow(userProfile.id, 'remove');
        }
      }
    }
  }

  useEffect(() => {
    checkUser(id);
  }, []);

  useEffect(() => {
    if (!profile) {
      setIsError(true);
    } else {
      setIsError(false);
      setUserProfile(profile)
      dispatch(setPosts([]))
      getAllPost(profile.id);
      if(user.username === profile.username){
        setMain(true)
      }
    }
  }, [profile]);


  if (loadingProfile) {
    return (
      <div className='bg-gray-100 w-screen h-screen flex justify-center items-center'>
        <div className='w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin'></div>
      </div>
    );
  }

  if (isError) {
    return <NotFound />;
  }

  return (
    <Layout>
      {userProfile && <div className='h-screen pt-[90px] px-52 w-screen flex flex-col gap-6 bg-backGround overflow-y-scroll overflow-x-hidden' id="scrollableDivProfile" >
          <div className='w-full flex flex-col h-[400px] rounded-3xl'>
              <div className='w-full h-2/3 bg-search relative' />
              <div className='w-full h-1/3 bg-navbar flex p-6'>
                <div className='flex flex-col text-textColor w-1/2 items-center'>
                  {main ? <div ref={modalRef}>
                    <DropDown
                      className='absolute right-[72px] top-[-128px]'
                      classNameContent='bg-search p-2 w-[200px] rounded-lg shadow-lg z-50 right-0 top-[10px]'
                      tabIndex={0}
                      parents={<Avatar
                        src={userProfile.avatar ?? ""}
                        className='w-32 h-32 rounded-full'
                        alt='avatar'
                        width={80}
                        height={80}
                        onClick={() => setOpenDropDown(!openDropDown)}
                      />}
                      children={
                        openDropDown && <div className='flex flex-col gap-2'>
                          <Button text='Change Avatar' onClick={handleOpenFileInput} disabled={loadingSaveImage} className='bg-navbar' />
                          {userProfile?.avatar !== '' && <Button text='Delete Avatar' iconLoading={loadingSaveImage} disabled={loadingSaveImage} onClick={handleDeleteAvatar} className='bg-navbar' />}
                        </div>
                      }
                    />
                  </div> : <Avatar
                        src={userProfile.avatar ?? ""}
                        className='w-32 h-32 rounded-full absolute right-[72px] top-[-128px]'
                        alt='avatar'
                        width={80}
                        height={80}
                      />}
                  <span className='font-bold text-xl'>{fullName}</span>
                  <span>@{userProfile.username}</span>
                </div>
                <div className='flex w-1/2 justify-end gap-2'>
                {  main ? 
                  <a href={`/information/${userProfile.username}`} className='w-1/3'>
                    <Button
                      text='Edit Profile'
                      className='text-white w-full bg-primaryColor hover:bg-primaryColor hover:text-textColor hover:opacity-60'
                    />
                  </a>
                  : <Button
                    text={userProfile.isFollow}
                    iconLoading={loadingFollow}
                    onClick={handleFollow}
                    className='text-white w-1/3 bg-primaryColor hover:bg-primaryColor hover:text-textColor capitalize hover:opacity-60'
                  />
                  
                  }
                  <Button 
                    text={main ? 'Change Password' : 'Message'}
                    className='text-primaryColor w-1/3 bg-textColor border-primaryColor hover:bg-textColor hover:text-backGround hover:opacity-60'
                    onClick={main ? handleOpenPostorMessage : handleMessage}
                  />
                  {isModalOpen && 
                    <Modal
                      onClose={() => {setIsModalOpen(false); reset()}}
                      title={<div className='w-full text-textColor text-center font-bold text-xl py-2'>Change Your Password</div>}
                      closeIcon
                      className='bg-navbar'
                      children={
                      <form className='w-full flex flex-col gap-2 text-textColor' onSubmit={handleSubmit(handleChangePassword)}>
                         <label className='text-textColor flex  text-sm font-bold w-full'>Current Password</label>
                          <Input
                              className='w-full h-10'
                              placeholder='Password...'
                              width={20}
                              height={20}
                              type={showPassword ? 'text' : 'password'}
                              onClick={() => setShowPassword(!showPassword)}
                              iconComponent={showPassword ? <FaEyeSlash /> : <FaEye />}
                              {...register('currentPassword', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                            />
                            {errors.currentPassword && (
                              <p className='text-red-600 text-sm py-1'>
                                {errors.currentPassword?.message}
                              </p>
                            )}

                          <label className='text-textColor flex  text-sm font-bold w-full'>New Password</label>
                          <Input
                              className='w-full h-10'
                              placeholder='New Password...'
                              width={20}
                              height={20}
                              onClick={() => setShowPassword(!showPassword)}
                              iconComponent={showPassword ? <FaEyeSlash /> : <FaEye />}
                              type={showPassword ? 'text' : 'password'}
                              {...register('newPassword', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                            />
                            {errors.newPassword && (
                              <p className='text-red-600 text-sm py-1'>
                                {errors.newPassword?.message}
                              </p>
                            )}

                          <label className='text-textColor flex  text-sm font-bold w-full'>Confirm Password</label>
                          <Input
                              className='w-full h-10'
                              placeholder='Confirm Password...'
                              type={showPassword ? 'text' : 'password'}
                              onClick={() => setShowPassword(!showPassword)}
                              iconComponent={showPassword ? <FaEyeSlash /> : <FaEye />}
                              {...register('confirmPassword', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                              width={20}
                              height={20}
                            />
                            {errors.confirmPassword && (
                              <p className='text-red-600 text-sm py-1'>
                                {errors.confirmPassword?.message}
                              </p>
                            )}

                          <Button text='Save' className='w-[200px] ml-auto mt-4 bg-primaryColor text-textColor' iconLoading={loadingPassword} />
                      </form>
                      }
                    />}
                </div>
              </div>
          </div>

          <div className='w-full gap-5 flex h-1/3'>

            <div className='w-1/3 p-4 rounded-lg text-textColor bg-navbar'>
                <MiniProfile 
                  hide 
                  user={userProfile}
                />
            </div>

            <div className='flex flex-col flex-1 w-2/3 gap-3 '>
              {main && <NewPost />}
              {posts.length > 0 &&
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchNextPosts}
                    hasMore={hasMore}
                    loader={<SkeletonPost />}
                    endMessage={<div className='w-full text-center font-bold text-xl my-2'>You read all post </div>}
                    className='my-infinite-scroll w-full flex flex-col gap-5'
                    scrollableTarget='scrollableDivProfile'
                  >
                    {posts.map((post) => (
                      <Post key={post.id} post={post} width={700} />
                    ))}
                  </InfiniteScroll> }
                  {!loading && posts.length === 0 && <div className='w-full text-center font-bold text-xl mt-3'>Let's create your first post</div>}
            </div>

            <input type='file' className='hidden' onChange={handleChangAvatar} ref={inputRef}/>

           {openChangeAvatar &&  
           <Modal
              title={<div className='w-full text-textColor text-center font-bold text-xl py-2'>Change Avatar</div>}
              closeIcon={!loadingImage}
              onClose={handleCloseModal}
              className='w-1/3 bg-navbar'
              children={<div className='w-full flex flex-col justify-center items-center gap-4'>
                <Avatar
                  src={imageAvatar ? imageAvatar : undefined}
                  className='max-w-96 max-h-max-w-96 rounded-full'
                  alt='avatar'
                  width={80}
                  height={80}
                  onClick={()=> inputRef.current?.click()}
                />
                <div className='flex gap-4 items-center'>
                  <Button text='Cancel' className=' w-[200px] text-textColor' disabled={loadingImage || loadingSaveImage} onClick={handleCloseModal} />
                  <Button text='Save' iconLoading={loadingImage || loadingSaveImage} disabled={loadingImage || loadingSaveImage} className='bg-primaryColor w-[200px] text-textColor' onClick={handleSaveAvatar} />
                </div>
              </div>}
            />}

          </div>
      </div>}
    </Layout>
  )
}

export default Profile