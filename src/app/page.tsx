'use client'

import React, { useCallback, useEffect} from 'react'
import {Avatar, BoxMessage, MiniProfile, NewPost, Post, SkeletonPost} from '@/components'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import useGetAllPost from '@/api/post/getAllPost'
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '@/components/DefaultLayout'
import { selectUser } from '@/redux/features/user/userSlice'
import { setCurrentPage, setHasMore, setPosts } from '@/redux/features/post/postSlice'
import useCheckUser from '@/api/user/checkUser'

const Home = React.memo(() => {

  const posts = useAppSelector((state) => state.post.posts);

  const loading = useAppSelector((state) => state.post.loading);

  const hasMore = useAppSelector((state) => state.post.hasMore);

  const user = useAppSelector(selectUser)

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
       <div className='h-screen p-[90px] w-screen flex justify-between bg-backGround overflow-y-auto overflow-x-hidden relative' id="scrollableDiv" >
          <div className='w-1/4 bg-navbar h-fit p-4 rounded-xl'>
              <MiniProfile 
                user={profile ?? user}
              />
          </div>
          <div className='h-full w-2/4 flex flex-col gap-5 px-5' >
              <NewPost />
              {<InfiniteScroll
                dataLength={posts.length}
                next={fetchNextPosts}
                hasMore={hasMore}
                loader={<SkeletonPost />}
                endMessage={!hasMore && <div className='w-full text-center font-bold text-xl my-2'>You read all post </div>}
                className='my-infinite-scroll-home w-full flex flex-col gap-5'
                scrollableTarget='scrollableDiv'
              >
                {posts.map((post) => (
                  <Post key={post.id} post={post} />
              ))}
              </InfiniteScroll>}
              {!loading && posts.length === 0 && <div className='w-full text-center font-bold text-xl mt-3'>Let's create your first post</div>}

          </div>
          <div className='w-1/4 '>friends</div>
          
          <div>
          </div>
        </div>
    </Layout>
  )
})

export default Home