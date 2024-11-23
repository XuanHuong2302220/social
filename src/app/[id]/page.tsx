'use client'
import useCheckUser from '@/api/user/checkUser'
import { Avatar, Button, DropDown, MiniProfile, Modal, ModalPost, NewPost, Post, SkeletonPost } from '@/components'
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
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/firebase/firebase'

const Profile = () => {

  const user = useAppSelector(selectUser)
  const {loading: loadingProfile, checkUser, profile} = useCheckUser()

  const { id } = useParams() as { id: string }
  const [isError, setIsError] = useState(false);
  const [main, setMain] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserState | undefined>(profile);
  const [avatar, setAvatar] = useState<File | null>(null)
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const posts = useAppSelector((state) => state.post.posts);

  const loading = useAppSelector((state) => state.post.loading);

  const hasMore = useAppSelector((state) => state.post.hasMore);

  const [openDropDown, setOpenDropDown] = useState(false)

  const {getAllPost} = useGetAllPost()

  const {loading: loadingFollow, createFollow} = useCreateFollow()

  const scroll = document.querySelector('.my-infinite-scroll') as HTMLElement;
  useEffect(()=> {
    if(scroll){
      scroll.style.overflowY = 'hidden'
    }
  })

  const fullName = `${profile?.firstName} ${profile?.lastName}`

  const modalRef = useRef<HTMLDivElement>(null)

  useClickOutside(modalRef, ()=> setOpenDropDown(false))

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
    } else {
      window.location.href = `/message/${user.username}`
    }
  }

  const handleCloseModal = ()=> {
    setOpenChangeAvatar(false)
  }

  const handleOpenFileInput = ()=> {
    setOpenChangeAvatar(true)
  }

  const handleChangAvatar = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      const url = URL.createObjectURL(file);
      if(url){
        setAvatar(file)
      }
    }
  }

  const handleSaveAvatar = async() => {
    const storageRef = ref(storage, `images/${avatar && avatar.name}`);
      try {
        setLoadingImage(true)
        const url = await getDownloadURL(storageRef);
        setUserProfile({
          ...userProfile,
          avatar: url
        })
        dispatch(setAttributes({
          ...user,
          avatar: url
        }))
        setOpenChangeAvatar(false)
      } catch (error) {
        setLoadingImage(true)
        if ((error as any).code === 'storage/object-not-found') {
          await uploadBytes(storageRef, avatar as Blob);
          const url = await getDownloadURL(storageRef);
          setUserProfile({
            ...userProfile,
            avatar: url
          })
          dispatch(setAttributes({
            ...user,
            avatar: url
          }))
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
           setUserProfile({
            ...userProfile,
            isFollow: 'Following',
            followers: userProfile.followers && userProfile.followers  + 1
          })
          dispatch(setAttributes({
            ...user,
            followings: user.followings && user.followings + 1,
          }))
        }
      }
      else {
        if (userProfile.id) {
          await createFollow(userProfile.id, 'remove');
          setUserProfile({
            ...userProfile,
            isFollow: 'follow',
            followers: userProfile.followers && userProfile.followers - 1
          })
          dispatch(setAttributes({
            ...user,
            followings: user.followings && user.followings - 1,
          }))
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
      {userProfile && <div className='h-screen pt-[90px] px-52 w-screen flex flex-col gap-6 bg-backGround overflow-y-auto overflow-x-hidden' id="scrollableDivProfile" >
          <div className='w-full flex flex-col h-[400px] rounded-3xl'>
              <div className='w-full h-2/3 bg-search relative' />
              <div className='w-full h-1/3 bg-navbar flex p-6'>
                <div className='flex flex-col text-textColor w-1/2 items-center'>
                  {main ? <div ref={modalRef}>
                    <DropDown
                      className='absolute right-[72px] top-[-87px]'
                      classNameContent='bg-search p-2 w-[200px] rounded-lg shadow-lg z-50 right-0 top-[50px]'
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
                          <Button text='Change Avatar' onClick={handleOpenFileInput} className='bg-navbar' />
                          <Button text='Delete Avatar' className='bg-navbar' />
                        </div>
                      }
                    />
                  </div> : <Avatar
                        src={userProfile.avatar ?? ""}
                        className='w-32 h-32 rounded-full absolute right-[72px] top-[-87px]'
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
                    text={main ? 'Add Post' : 'Message'}
                    className='text-primaryColor w-1/3 bg-textColor border-primaryColor hover:bg-textColor hover:text-backGround hover:opacity-60'
                    onClick={handleOpenPostorMessage}
                  />
                  {isModalOpen && 
                  <ModalPost
                    onClose={() => setIsModalOpen(false)}
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
              {
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
              closeIcon
              onClose={handleCloseModal}
              className='w-1/3 bg-navbar'
              children={<div className='w-full flex flex-col justify-center items-center gap-4'>
                <Avatar
                  src={avatar ? URL.createObjectURL(avatar) : ''}
                  className='max-w-96 max-h-max-w-96 rounded-full'
                  alt='avatar'
                  width={80}
                  height={80}
                  onClick={()=> inputRef.current?.click()}
                />
                <div className='flex gap-4 items-center'>
                  <Button text='Cancel' className=' w-[200px] text-textColor' disabled={loadingImage} onClick={handleCloseModal} />
                  <Button text='Save' iconLoading={loadingImage} disabled={loadingImage} className='bg-primaryColor w-[200px] text-textColor' onClick={handleSaveAvatar} />
                </div>
              </div>}
            />}

          </div>
      </div>}
    </Layout>
  )
}

export default Profile