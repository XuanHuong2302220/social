'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import withAuth from '@/middleware/withAuth'
import { ModalPost, NewPost, Post, SkeletonPost} from '@/components'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectUser } from '@/redux/features/user/userSlice'
import useGetAllPost from '@/api/post/getAllPost'
import InfiniteScroll from 'react-infinite-scroll-component';
import axs from '@/utils/axios'
import { addPosts, setCurrentPage } from '@/redux/features/post/postSlice'
import Layout from '@/components/DefaultLayout'

const Home = React.memo(() => {

  const posts = useAppSelector((state) => state.post.posts);

  const loading = useAppSelector((state) => state.post.loading);

  const hasMore = useAppSelector((state) => state.post.hasMore);

  const {getAllPost} = useGetAllPost()

  const scroll = document.querySelector('.my-infinite-scroll') as HTMLElement;
  useEffect(()=> {
    if(scroll){
      scroll.style.overflowY = 'hidden'
    }
  })

  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        await getAllPost();
      } catch (error) {
        console.error('Lỗi khi lấy bài đăng ban đầu:', error);
      }
    };

    fetchInitialPosts();
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
       <div className='h-screen p-[90px] w-screen flex justify-between overflow-auto overflow-x-hidden' id="scrollableDiv" >
          <div className='w-1/4 bg-navbar'>profile</div>
          <div className='h-full w-2/4 flex flex-col gap-5 px-5'>
              <NewPost />
              <InfiniteScroll
                  dataLength={posts.length}
                  next={fetchNextPosts}
                  hasMore={hasMore}
                  loader={<SkeletonPost />}
                  endMessage={'No more posts'}
                  className='my-infinite-scroll w-full flex flex-col gap-5'
                  scrollableTarget='scrollableDiv'
                >
                  {posts.map((post, index) => (
                    <Post key={post.id} post={post} />
                ))}
                </InfiniteScroll> 

          </div>
          <div className='w-1/4 bg-navbar'>friends</div>
          
        </div>
    </Layout>
  )
})

export default Home