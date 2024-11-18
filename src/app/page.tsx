'use client'

import React, { useCallback, useEffect} from 'react'
import {Avatar, MiniProfile, NewPost, Post, SkeletonPost} from '@/components'
import { useAppSelector } from '@/redux/hooks'
import useGetAllPost from '@/api/post/getAllPost'
import InfiniteScroll from 'react-infinite-scroll-component';
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
       <div className='h-screen p-[90px] w-screen flex justify-between bg-backGround overflow-auto overflow-x-hidden' id="scrollableDiv" >
          <div className='w-1/4 bg-navbar h-fit p-4 rounded-xl'>
              <MiniProfile />
          </div>
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