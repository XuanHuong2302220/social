'use client'

import React, { useCallback, useEffect} from 'react'
import {Avatar,MiniProfile, NewPost, Post, SkeletonPost} from '@/components'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import useGetAllPost from '@/api/post/getAllPost'
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '@/components/DefaultLayout'
import { selectUser } from '@/redux/features/user/userSlice'
import { setPosts } from '@/redux/features/post/postSlice'
import useCheckUser from '@/api/user/checkUser'

const Home = () => {

  const posts = useAppSelector((state) => state.post.posts);

  const loading = useAppSelector((state) => state.post.loading);

  const hasMore = useAppSelector((state) => state.post.hasMore);

  const user = useAppSelector(selectUser)

  const userOnline = useAppSelector((state) => state.socket.userOnline) ?? []

  const dispatch = useAppDispatch()

  const {getAllPost} = useGetAllPost()

  const {checkUser, profile} = useCheckUser()

  const scroll = document.querySelector('.my-infinite-scroll-home') as HTMLElement;
  useEffect(()=> {
    if(scroll){
      scroll.style.overflowY = 'hidden'
    }
  })

  useEffect(() => {
    dispatch(setPosts([]));
    getAllPost();
    if (user.username) {
      checkUser(user.username);
    }
  }, []);

  const fetchNextPosts = useCallback(async () => {
    try {
      await getAllPost();
    } catch (error) {
      console.error('Lỗi khi lấy bài đăng tiếp theo:', error);
    }
  }, [loading, hasMore, getAllPost]);

  return (
    <Layout>
       <div className='h-screen p-[90px] tablet:px-5 phone:px-5 w-screen flex justify-between bg-backGround overflow-y-auto overflow-x-hidden relative' id="scrollableDiv" >
          <div className='w-1/4 bg-navbar laptop:block tablet:hidden phone:hidden h-fit p-4 rounded-xl'>
              <MiniProfile 
                user={profile ?? user}
              />
          </div>
          <div className='h-full desktop:w-2/4 laptop:w-2/4 tablet:w-full phone:w-full flex flex-col gap-5 px-5' >
              <NewPost />
              {<InfiniteScroll
                dataLength={posts.length}
                next={fetchNextPosts}
                hasMore={hasMore}
                loader={<SkeletonPost />}
                endMessage={!hasMore && posts.length > 0 && <div className='w-full text-center font-bold text-xl my-2'>You read all post </div>}
                className='my-infinite-scroll-home w-full flex flex-col gap-5'
                scrollableTarget='scrollableDiv'
              >
                {posts.map((post) => (
                  <Post key={post.id} post={post} width={900} />
                ))}
              </InfiniteScroll>}
              {!loading && posts.length === 0 && <div className='w-full text-center font-bold text-xl mt-3'>Let&apos;s create your first post</div>}

          </div>
          <div className='w-1/4 laptop:block tablet:hidden phone:hidden'>
              <div className='bg-navbar h-fit p-4 rounded-xl'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-xl font-bold text-textColor'>Online Users</h1>
                  <span className='text-md font-semibold text-textColor'>{userOnline.length} users</span>
                </div>
                <div className='flex flex-col gap-2 mt-2'>
                  {userOnline.length > 0 && userOnline.map((user) => (
                    <div key={user.id} className='flex items-center gap-2'>
                      <Avatar src={user.avatar ?? undefined} id={user.id} alt='avatar' width={1} height={1} className='w-10 h-10' />
                      <span className='text-md font-semibold text-textColor'>{user.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
          </div>
          
          <div>
          </div>
        </div>
    </Layout>
  )
}

export default Home